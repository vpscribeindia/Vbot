CLIENT START - ./client/
    npm install
    npm run dev
MICROSERVICE START 
1) Redis setup and start
   docker pull redis
   docker run --name my-redis -d -p 6379:6379 redis
   docker start my-redis
2) api-gateway service start - ./server/api-gateway/
   npm install
   npm start
   .env should be

   PORT=3000
   REDIS_URL=redis://127.0.0.1:6379
   APP_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

4) worker-service start - ./server/worker-service/
   npm install
   npm start
   .env should be

   REDIS_URL=redis://127.0.0.1:6379
   GEMINI_API_KEY=
   DEEPGRAM_API_KEY=

(*** NOTE : FIRST CONFIGURE .env files with your api keys ***)
