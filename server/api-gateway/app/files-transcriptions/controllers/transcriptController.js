const { Transcript, File, Billing, Template, Op } = require("../../../config/db");
const { addTranscriptJob } = require('../services/queueService');
async function updateTranscript(req, res) {
  const { fileId, transcript } = req.body;
  if (!fileId || !transcript || typeof transcript !== 'object') {
    return res.status(400).json({ message: "fileId and transcript (object) are required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const file = await File.findOne({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You do not own this file" });
    }

    const note = await Transcript.findOne({ where: { fileId } });
    if (!note) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    note.content = {
      ...note.content,
      ...transcript
    };

    await note.save();

    res.json({
      message: "Transcript updated successfully",
      note
    });

  } catch (error) {
    console.error("Error updating transcript:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

async function reFormatTranscript(req, res, next) {
  try {

    if (!req.user || !req.user.id || !req.body.fileId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const userId = req.user.id;
    const fileId = req.body.fileId;
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
      return res.status(401).json({ error: msg });
    }


    const jobData = {
      fileId: fileId,
      template_name: templateName
    };

    await addTranscriptJob(jobData);
    res.status(202).json({
      status: 'Transcription queued for processing',
      fileId:fileId
    });


  } catch (error) {
    next(error);
  }
}

async function getAllTemplateNames(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const templates = await Template.findAll({
      attributes: ['templateName'],
      order: [['createdAt', 'DESC']],
    });

    const templateNames = templates.map(t => t.templateName);

    res.status(200).json({ templateNames }); 
  } catch (error) {
    next(error);
  }
}
async function updatePatientName(req, res) {
  const { fileId, patientName } = req.body;

  if (!req.user || !req.user.id || !fileId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const patient = await Transcript.findOne({ where: { fileId } });
    if (!patient) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    patient.patientName = patientName; 
    await patient.save();

    res.json({
      message: "Transcript updated successfully",
    });

  } catch (error) {
    console.error("Error updating patient Name:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}


module.exports = { updateTranscript,reFormatTranscript,getAllTemplateNames,updatePatientName };
