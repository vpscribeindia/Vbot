require('dotenv').config();
const { Worker } = require('bullmq');
const { transcribeAudio } = require('./services/deepgramService');
const { normalizeAudio } = require('./services/audioConversion');
const redisConnection = require('./config/redis');
const redisPub = require('./config/redis');

async function processJob(job) {
  const { filePath} = job.data;
  let convertedFilePath;
  try {
    
    redisPub.publish('progress', JSON.stringify({ fileId:job.id, status: 'Converting audio' }));
    // Convert audio to 16kHz WAV
    convertedFilePath = await normalizeAudio(filePath);
    
    redisPub.publish('progress', JSON.stringify({ fileId:job.id, status: 'Audio conversion complete' }));
    // Transcribe audio with Deepgram
    const rawTranscript = await transcribeAudio(convertedFilePath, process.env.DEEPGRAM_API_KEY);
    redisPub.publish('progress', JSON.stringify({ fileId:job.id, status: 'Transcription complete' }));
  
       // Publish final progress update
       redisPub.publish('progress', JSON.stringify({
        fileId:job.id,
        status: 'completed',
        transcript:rawTranscript
      }));
    return { transcript: rawTranscript };
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    throw error;
  }
}

const worker = new Worker('file-processing', processJob, { 
  connection: redisConnection, 
  concurrency: 5 
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
