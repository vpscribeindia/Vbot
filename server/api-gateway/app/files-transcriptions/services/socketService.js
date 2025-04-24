const Redis = require('ioredis');
const subscriber = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

function setupSocket(io) {
  subscriber.subscribe('progress', 'progress_transcript', (err) => {
    if (err) console.error('Redis subscribe error:', err);
  });

  subscriber.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      io.emit(channel, data);
    } catch (err) {
      console.error(`Error parsing ${channel} message:`, err);
    }
  });

  subscriber.on('error', (err) => {
    console.error('Redis error:', err);
  });
}

module.exports = setupSocket;
