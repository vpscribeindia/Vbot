const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../controllers/fileController');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.post('/transcribe', upload.single('audioFiles'), uploadFile);

module.exports = router;
