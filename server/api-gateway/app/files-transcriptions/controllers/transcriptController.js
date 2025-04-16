const { Transcript, File } = require("../../../config/db");

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

module.exports = { updateTranscript };
