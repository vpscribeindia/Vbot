const { Queue } = require('bullmq');
const redisConnection = require('../../../config/redis');

const fileQueue = new Queue('file-processing', { connection: redisConnection });

async function addFileJob(data) {
  return await fileQueue.add('processFile', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  });
}

module.exports = { addFileJob };
