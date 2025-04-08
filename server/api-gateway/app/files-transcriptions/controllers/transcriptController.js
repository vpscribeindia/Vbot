const {Transcript} = require("../../../config/db");

async function updateTranscript(req, res) {
  const { fileId, transcript } = req.body;
  
  try {

    const note = await Transcript.findOne({ where: { fileId } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.content = { ...note.content, ...transcript };

    await note.save();
    res.json({ message: "SOAP Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
module.exports = { updateTranscript };
