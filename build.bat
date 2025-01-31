@echo off
setlocal

echo Building frontend...
cd connectify
call npm run build
cd ..

echo Building backend...
cd backend
call npm run build
cd ..

echo Building Docker image...
docker build -t shubhamdockr/connectify:2.0 .

docker push shubhamdockr/connectify:2.0

echo Build process completed!

endlocal
