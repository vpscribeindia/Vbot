CLIENT START - ./client/
   npm install (first time)
    npm run dev

MICROSERVICE START 
1) in powershell run as administrator(For Windows only)
Run :
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Then run :
choco install ffmpeg  (For windows)
sudo apt install ffmpeg (For Linux)

2) Redis setup and start
   docker pull redis
   docker run --name my-redis -d -p 6379:6379 redis
   docker start my-redis
   
3) api-gateway service start - ./server/api-gateway/
   npm install (first time)
   npm start
   .env should be

NODE_ENV = 'development'
PORT=3000
REDIS_URL=redis://127.0.0.1:6379
APP_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
GOOGLE_CLIENT_ID=ask team
GOOGLE_CLIENT_SECRET=ask team
JWT_SECRET=ec6a84728c450a6cf016a0dd57bc54ae0023ac88e96b1934f42220c90cf8fcf5
DB_NAME=vbot_new
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
FRONTEND_URL=http://localhost:5173/
REDIRECT_DOMAIN=http://localhost
EMAIL_APP_PASS=ask team
EMAIL_USER=ask team
4) worker-service start - ./server/worker-service/
   npm install (first time)
   npm start
   .env should be

REDIS_URL=redis://127.0.0.1:6379
GEMINI_API_KEY= ask team
DEEPGRAM_API_KEY= ask team

DB_NAME=vbot_new
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000


(*** NOTE : FIRST CONFIGURE .env files with your api keys ***)
