require('dotenv').config();
const { Worker } = require('bullmq');
const Path = require('path');
const { transcribeAudio } = require('./services/deepgramService');
const { templateTranscript } = require('./services/templateService');
const { compressAudio, highQualityAudio } = require('./services/audioConversion');
const redisConnection = require('./config/redis');
const redisPub = require('./config/redis');
const { File, Transcript } = require('./config/db');



async function processJob(job) {
  const { filePath, fileId, actualDuration, patientName } = job.data;
  let convertedFilePath, finalTranscript;

  try {
    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Converting audio' }));
    convertedFilePath = await highQualityAudio(filePath);

    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Audio conversion complete' }));
    const {rawTranscript, conversationTranscript} = await transcribeAudio(convertedFilePath, process.env.DEEPGRAM_API_KEY);
    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Transcription complete' }));
    await File.update({ status: 'processing' }, { where: { id: fileId } });

    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Formatting transcript' }));
    const customTemplate = `
You are a medical AI assistant. Extract structured clinical notes in **SOAP format**.

### **Input:**
{transcription}

### **Output Guidelines:**
- **Strictly** use the exact headings enclosed in **square brackets** (e.g., **[Subjective]**, **[Objective]**).  
- Do **not** use markdown-style headings like "##".
- Keep responses **structured and formatted** properly.

### **SOAP Notes Output:**
[Visit Summary]  
[Subjective]  
[Objective]  
[Assessment]  
[Plan]  
[Patient Instructions]  
[Transcript Summary]  
`;
    finalTranscript = await templateTranscript(rawTranscript, customTemplate, process.env.GEMINI_API_KEY);

    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Compressing Audio' }));
    const compressedFile = await compressAudio(convertedFilePath);
    const fileName = Path.basename(compressedFile);

    redisPub.publish('progress', JSON.stringify({ fileId:fileId, status: 'Saving Audio' }));
    await File.update({ fileName:fileName, duration: actualDuration, status: 'completed' }, { where: { id: fileId } });
    await Transcript.create({ fileId:fileId, patientName:patientName, content: finalTranscript, rawContent: rawTranscript, conversationContent: conversationTranscript });

    redisPub.publish('progress', JSON.stringify({
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

const worker = new Worker('file-processing', processJob, {
  connection: redisConnection,
  concurrency: 5
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
