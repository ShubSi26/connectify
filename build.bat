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
docker build -t connectify .

echo Build process completed!

endlocal
