const {File, Transcript} = require("../../../config/db");
const { addFileJob } = require('../services/queueService');
const Path = require("path");
const fs = require('fs');

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { path } = req.file;
    const fileName=Path.basename(path);
    const file=await File.create({fileName: fileName, status: 'queued'});
    const jobData = {
      fileId: file.id,
      filePath: path
    };
    await addFileJob(jobData);
    res.status(202).json({ status: 'File queued for processing', fileId: file.id });
  } catch (error) {
    next(error);
  }
}

async function getFileProgress(req, res) {
  try {
    const { fileId } = req.params;
    const file = await File.findOne({
      where: { id: fileId },
      include: [{ model: Transcript, attributes: ["content"] }],
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      transcript: file.Transcript ? file.Transcript.content : null, 
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function getAllFiles(req, res) {
    try {
      const jobs = await File.findAll({
        attributes: [["id", "fileId"], "status", "duration","fileName"], 
        order: [["createdAt", "DESC"]],
      });
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  }

  
async function deleteFile(req, res){
  const { fileId } = req.params;

  try {
    const file = await File.findOne({ where: { id: fileId } });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = Path.join(__dirname, "../uploads",file.fileName);
    
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
