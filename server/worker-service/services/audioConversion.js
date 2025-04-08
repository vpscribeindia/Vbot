const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

ffmpeg.setFfmpegPath(ffmpegStatic);

function getAudioDuration(inputPath){
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.error("Error fetching audio duration:", err.message);
        return reject(new Error("Failed to retrieve audio duration."));
      }
      const duration = parseFloat(metadata.format.duration);
      resolve(duration);
    });
  });
};

function compressAudio(inputPath) {
  const outputPath = path.join(
    path.dirname(inputPath),
    `${path.basename(inputPath, path.extname(inputPath))}.opus`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libopus") 
      .audioBitrate("32k") 
      .audioFrequency(16000) 
      .audioChannels(1) 
      .audioFilters([
        "afftdn=nr=20",   
        "highpass=f=200", 
        "lowpass=f=7000"  
      ])
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
function highQualityAudio(inputPath) {
  const outputPath = path.join(
    path.dirname(inputPath),
    `${path.basename(inputPath, path.extname(inputPath))}.flac`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("flac") 
      .audioBitrate("512k") 
      .audioFrequency(32000) 
      .audioChannels(1) 
      .audioFilters([
        "afftdn=nr=20", 
        "highpass=f=100", 
        "lowpass=f=7500" 
      ])
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
        reject(new Error("FFmpeg conversion to FLAC failed."));
      })
      .save(outputPath);
  });
}
module.exports = { compressAudio,highQualityAudio,getAudioDuration };
