const express = require('express');
const multer = require('multer');
const path = require('path');
const { getFileProgress, getAllFiles, deleteFile, uploadFile } = require("../controllers/fileController");
const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.post('/transcribe', upload.single('audioFiles'), uploadFile);
router.get("/progress/:fileId", getFileProgress);
router.get("/fetchall", getAllFiles);
router.delete("/deletefile/:fileId", deleteFile);

module.exports = router;
