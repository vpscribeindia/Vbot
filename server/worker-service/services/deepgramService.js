const fs = require('fs');
const { createClient } = require("@deepgram/sdk");
async function transcribeAudio(filePath, deepgramApiKey) {
    try {
        const deepgram = createClient(deepgramApiKey);
        const fileBuffer = fs.readFileSync(filePath);
        const { result, error } =
          await deepgram.listen.prerecorded.transcribeFile(fileBuffer, {
            model: "nova-3-medical",
            detect_language: true,
            smart_format: true,
            punctuate: true,
            dictation: true,
            diarize: true,
            numerals: true
          });
  
        if (error) {
          console.error("Deepgram transcription error:", error);
          throw error;
        }

        const transcript = result.results.channels[0]?.alternatives[0]?.transcript || "";
        return transcript;
      } catch (err) {
        console.error("Error transcribing with Deepgram:", err);
        throw err;
      }
}

module.exports = { transcribeAudio };
