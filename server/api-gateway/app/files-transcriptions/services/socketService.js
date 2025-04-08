const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL;
const subscriber = new Redis(redisUrl, { maxRetriesPerRequest: null });

function setupSocket(io) {
  subscriber.subscribe('progress', (err) => {
    if (err) console.error('Redis subscribe error:', err);
  });
  
  subscriber.on('message', (channel, message) => {
    if (channel === 'progress') {
      try {
        const progressData = JSON.parse(message);
        io.emit('progress', progressData);
      } catch (err) {
        console.error('Error parsing progress message:', err);
      }
    }
  });
}

module.exports = setupSocket;
