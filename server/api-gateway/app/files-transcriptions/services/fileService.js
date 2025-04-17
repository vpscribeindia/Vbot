const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");

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

module.exports = { getAudioDuration };
