const { addFileJob } = require('../services/queueService');

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, path } = req.file;
    const jobData = {
      filePath: path,
      originalName: originalname,
    };
    const job=await addFileJob(jobData);
    res.status(202).json({ status: 'File queued for processing', fileId: job.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadFile };
