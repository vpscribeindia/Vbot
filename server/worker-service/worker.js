require('dotenv').config();
const { Worker } = require('bullmq');
const Path = require('path');
const { transcribeAudio } = require('./services/deepgramService');
const { templateTranscript } = require('./services/templateService');
const { compressAudio, highQualityAudio } = require('./services/audioConversion');
const redisConnection = require('./config/redis');
const redisPub = require('./config/redis');
const { File, Transcript, Template } = require('./config/db');

async function processJob(job) {
  const { filePath, fileId, actualDuration, patientName, template_name, userId } = job.data;
  let convertedFilePath, finalTranscript;

  try {
    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Converting audio' }));
    convertedFilePath = await highQualityAudio(filePath);

    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Audio conversion complete' }));
    const {rawTranscript, conversationTranscript} = await transcribeAudio(convertedFilePath, process.env.DEEPGRAM_API_KEY);
    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Transcription complete' }));
    await File.update({ status: 'processing' }, { where: { id: fileId } });

    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Formatting transcript' }));
    const template = await Template.findOne({ where: { templateName: template_name } });

    finalTranscript = await templateTranscript(rawTranscript,template, process.env.GEMINI_API_KEY);

    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Compressing Audio' }));
    const compressedFile = await compressAudio(convertedFilePath);
    const fileName = Path.basename(compressedFile);

    redisPub.publish(`progress:${userId}`, JSON.stringify({ fileId:fileId, status: 'Saving Audio' }));
    await File.update({ fileName:fileName, duration: actualDuration, status: 'completed' }, { where: { id: fileId } });
    await Transcript.create({ fileId:fileId, patientName:patientName, content: finalTranscript, rawContent: rawTranscript, conversationContent: conversationTranscript, templateId: template.id });

    redisPub.publish(`progress:${userId}`, JSON.stringify({
      fileId:fileId,
      status: 'completed',
      duration: actualDuration,
      fileName:fileName,
      PatientName:patientName
    }));

  } catch (error) {
    console.error(`Job ${job.id} failed:`, error);
    await File.update({ status: 'failed' }, { where: { id:fileId } });
    throw error;
  }
}

async function processTranscriptionJob(job) {
  const { fileId, template_name,userId } = job.data;
  try {
  const existing = await Transcript.findOne({ where: { fileId } });
  if (!existing) throw new Error(`No transcript found for fileId ${fileId}`);

  const template = await Template.findOne({ where: { templateName: template_name } });
  if (!template) throw new Error(`Template ${template_name} not found`);

  redisPub.publish(`progress_transcript:${userId}`, JSON.stringify({ fileId:fileId, status: 'Formatting transcript' }));

  const formatted = await templateTranscript(
    existing.rawContent,
    template,
    process.env.GEMINI_API_KEY
  );

  redisPub.publish(`progress_transcript:${userId}`, JSON.stringify({ fileId:fileId, status: 'Updating transcript' }));

  await Transcript.update(
    { content: formatted, templateId: template.id },
    { where: { fileId } }
  );

  redisPub.publish(`progress_transcript:${userId}`, JSON.stringify({
    fileId:fileId,
    status: 'completed'
  }));
}catch (error) {
  console.error(`Job ${job.id} failed:`, error);
  throw error;
}
}


const worker = new Worker('file-processing', processJob, {
  connection: redisConnection,
  concurrency: 5
});
const transcriptionWorker = new Worker('transcription-processing', processTranscriptionJob, {
  connection: redisConnection,
  concurrency: 5
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

transcriptionWorker.on('completed', (job, result) => {
  console.log(`Transcription job ${job.id} completed.`);
});
transcriptionWorker.on('failed', (job, err) => {
  console.error(`Transcription job ${job.id} failed:`, err);
});
