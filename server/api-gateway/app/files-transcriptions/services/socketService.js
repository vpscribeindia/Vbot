const Redis = require('ioredis');
const subscriber = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
const { socketAuth } = require('../../../middlewares/authHandler');

function setupSocket(io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const userId = socket.user?.id; 
    if (userId) {
      socket.join(userId);
      socket.on('disconnect', () => {});
    } else {
      socket.disconnect(true);  
    }
  });

  subscriber.psubscribe('progress:*', 'progress_transcript:*', (err) => {
    if (err) {
      console.error('Redis psubscribe error:', err);
    }
  });


  subscriber.on('pmessage', (pattern, channel, message) => {
    try {
      const [, userId] = channel.split(':'); 
      const data = JSON.parse(message);

      io.to(userId).emit(
        channel.startsWith('progress_transcript') ? 'progress_transcript' : 'progress', 
        data
      );
    } catch (err) {
      console.error(`Error handling message from ${channel}:`, err);
    }
  });

 
  subscriber.on('error', (err) => {
    console.error('Redis error:', err);
  });
}

module.exports = setupSocket;
