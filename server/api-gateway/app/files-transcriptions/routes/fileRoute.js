const express = require('express');
const multer = require('multer');
const path = require('path');
const { getFileProgress, getAllFiles, deleteFile, uploadFile } = require("../controllers/fileController");
const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });
const authenticate = require('../../../middlewares/authHandler');
router.post('/transcribe',authenticate, upload.single('audioFiles'), uploadFile);
router.get("/progress/:fileId",authenticate, getFileProgress);
router.get("/fetchall",authenticate, getAllFiles);
router.delete("/deletefile/:fileId",authenticate, deleteFile);

module.exports = router;
