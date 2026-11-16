@echo off
echo ========================================================
echo Starting AI Enhanced Learning Assistant - Angular Frontend
echo Port: 4200 ^| URL: http://localhost:4200
echo ========================================================
if not exist "node_modules\" (
    echo [INFO] First time run detected: Installing npm dependencies...
    npm install
)
npm start
pause
