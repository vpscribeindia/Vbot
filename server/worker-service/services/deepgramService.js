const fs = require('fs');
const { createClient } = require("@deepgram/sdk");
async function transcribeAudio(filePath, deepgramApiKey) {
    try {
        const deepgram = createClient(deepgramApiKey);
        const fileBuffer = fs.readFileSync(filePath);
        const { result, error } =
          await deepgram.listen.prerecorded.transcribeFile(fileBuffer, {
            model: "nova-2",
            detect_language: true,
            smart_format: true,
            punctuate: true,
            dictation: true,
            diarize: true,
            numerals: true
          });
          const formatTranscript = (data) => {
            if (!data || !data.paragraphs) return { error: "Invalid data format." };
          
            return data.paragraphs.map(({ speaker, sentences }) => ({
              [`Speaker ${speaker}`]: sentences.map(({ text, start, end }) => ({
                startTime: formatTime(start),
                endTime: formatTime(end),
                text
              }))
            }));
          };
          
          
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      };

          
        if (error) {
          console.error("Deepgram transcription error:", error);
          throw error;
        }

        const rawTranscript = result.results.channels[0]?.alternatives[0]?.transcript || "";
        const data = result?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs;
      const conversationTranscript = formatTranscript(data);

        return {rawTranscript,conversationTranscript};
      } catch (err) {
        console.error("Error transcribing with Deepgram:", err);
        throw err;
      }
}

module.exports = { transcribeAudio };
