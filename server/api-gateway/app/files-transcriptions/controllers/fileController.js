const { File, Transcript, Billing, Template, Op } = require("../../../config/db");
const { addFileJob } = require('../services/queueService');
const Path = require("path");
const fs = require('fs');

const { getAudioDuration } = require('../services/fileService'); 
const { parseUsageLimit, subtractUsageLimit } = require('../utils/limitUtils');

async function uploadFile(req, res, next) {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
  
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }



    const { path } = req.file;
    const fileName = Path.basename(path);
    const userId = req.user.id;
    const patientName = req.body.patientName;
    const templateName = req.body.templateName;


    const activeBilling = await Billing.findOne({
      where: {
        user_id: userId,
        status: 'paid',
        package_end_date: { [Op.gt]: new Date() }
      },
      order: [['package_start_date', 'DESC']]
    });

    if (!activeBilling) {
      const msg = `No active billing found for user`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      return res.status(401).json({ error: msg });
    }

    const maxSeconds = parseUsageLimit(activeBilling.usage_limit);
    let actualDuration;

    if (!req.body.audioduration) {
      actualDuration = await getAudioDuration(path);
    } else {
      actualDuration = parseUsageLimit(req.body.audioduration);
    }
    

    if (actualDuration > maxSeconds) {
      const msg = `Audio too long (${actualDuration}s), exceeds billing quota (${maxSeconds}s).`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      return res.status(401).json({ error: msg });
    }

  
    const file = await File.create({
      fileName: fileName,
      status: 'queued',
      user_id: userId
    });

    const jobData = {
      fileId: file.id,
      filePath: path,
      actualDuration: actualDuration,
      patientName: patientName,
      template_name: templateName
    };

    await addFileJob(jobData);
    const updatedLimit = subtractUsageLimit(activeBilling.usage_limit, actualDuration);
    res.status(202).json({
      status: 'File queued for processing',
      fileId: file.id,
      usage_limit: updatedLimit
    });

    
    await Billing.update({ usage_limit: updatedLimit }, { where: { id: activeBilling.id } });

  } catch (error) {
    next(error);
  }
}


async function getFileProgress(req, res) {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({
      where: { id: fileId },
      include: [{
        model: Transcript,
        attributes: ['content', 'conversationContent'],
        include: [{
          model: Template,
          attributes: ['templateName']
        }]
      }],
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const transcript = file.Transcript;

    res.json({
      transcript: transcript ? transcript.content : null,
      conversationTranscript: transcript ? transcript.conversationContent : null,
      templateName: transcript && transcript.Template
        ? transcript.Template.templateName
        : null
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllFiles(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const jobs = await File.findAll({
      where: { user_id: req.user.id },
      attributes: [["id", "fileId"], "status", "duration", "fileName"],
      include: [
        {
          model: Transcript,
          attributes: ["patientName"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedJobs = jobs.map((job) => {
      const jobData = job.toJSON();
      return {
        ...jobData,
        PatientName: jobData.Transcript?.patientName || null,
      };
    });

    res.json(formattedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}


async function deleteFile(req, res) {
  const { fileId } = req.params;

  try {
    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }


    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const filePath = Path.join(__dirname, "../uploads", file.fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Transcript.destroy({ where: { fileId } });
    await File.destroy({ where: { id: fileId } });

    res.json({ message: "File and transcript deleted successfully" });

  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getFileProgress, getAllFiles, deleteFile, uploadFile };
