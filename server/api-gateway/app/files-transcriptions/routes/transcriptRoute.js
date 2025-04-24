const express = require('express');
const { updateTranscript, getAllTemplateNames, reFormatTranscript, updatePatientName  } = require("../controllers/transcriptController");
const router = express.Router();
const authenticate = require('../../../middlewares/authHandler');
router.put("/updatetranscript",authenticate, updateTranscript);
router.get("/fetchalltemplates",authenticate, getAllTemplateNames);
router.post("/reformatthis",authenticate, reFormatTranscript);
router.post("/updatepatientname",authenticate, updatePatientName);

module.exports = router;
