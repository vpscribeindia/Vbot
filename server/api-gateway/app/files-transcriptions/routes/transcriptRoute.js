const express = require('express');
const { updateTranscript  } = require("../controllers/transcriptController");
const router = express.Router();
router.put("/updatetranscript", updateTranscript);
module.exports = router;
