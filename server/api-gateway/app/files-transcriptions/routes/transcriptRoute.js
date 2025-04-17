const express = require('express');
const { updateTranscript  } = require("../controllers/transcriptController");
const router = express.Router();
const authenticate = require('../../../middlewares/authHandler');
router.put("/updatetranscript",authenticate, updateTranscript);
module.exports = router;
