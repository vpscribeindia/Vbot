CLIENT START - ./client/
    npm run dev
MICROSERVICE START 
1) Redis setup and start
   docker pull redis
   docker run --name my-redis -d -p 6379:6379 redis
   docker start my-redis
   
2) api-gateway service start - ./server/api-gateway/
   npm start
   .env should be

   PORT=3000
   REDIS_URL=redis://127.0.0.1:6379
   APP_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

   DB_NAME=vbot_new
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_POOL_MAX=10
   DB_POOL_MIN=0
   DB_POOL_ACQUIRE=30000
   DB_POOL_IDLE=10000

3) worker-service start - ./server/worker-service/
   npm start
   .env should be

   REDIS_URL=redis://127.0.0.1:6379
   GEMINI_API_KEY=
   DEEPGRAM_API_KEY=

   DB_NAME=vbot_new
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_POOL_MAX=10
   DB_POOL_MIN=0
   DB_POOL_ACQUIRE=30000
   DB_POOL_IDLE=10000

(*** NOTE : FIRST CONFIGURE .env files with your api keys ***)
