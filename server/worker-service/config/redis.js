const Redis = require('ioredis');
const redisUrl = process.env.REDIS_URL;
const redisConnection = new Redis(redisUrl, { maxRetriesPerRequest: null });
module.exports = redisConnection;
