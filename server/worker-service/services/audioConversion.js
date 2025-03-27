const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

ffmpeg.setFfmpegPath(ffmpegStatic);

function normalizeAudio(inputPath) {
 const outputPath = path.join(
     path.dirname(inputPath),
     `${path.basename(inputPath, path.extname(inputPath))}.wav`
   );
 
   return new Promise((resolve, reject) => {
     ffmpeg(inputPath)
     .audioChannels(1)
     .audioFrequency(16000)
     .toFormat("wav")
       .on("end", async () => {
         try {
           await unlinkAsync(inputPath);
         } catch (delError) {
           console.error(`Error deleting temp file ${inputPath}:`, delError.message);
         }
           resolve(outputPath);
       })
       .on("error", (err) => {
         console.error("Error during conversion:", err.message);
         reject(new Error("FFmpeg conversion to Opus failed."));
       })
       .save(outputPath);
   });
}
module.exports = { normalizeAudio };
