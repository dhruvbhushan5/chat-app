@echo off
cd /d "%~dp0"
echo ==========================================
echo       Setting up Snappy Chat App
echo ==========================================

REM Check for MongoDB
echo Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB service not found. Please ensure MongoDB is installed and running!
    echo If you use Docker, please run 'docker-compose up' instead.
) else (
    echo Attempting to start MongoDB service...
    net start MongoDB 2>nul
)

REM Setup Public (Frontend)
echo.
echo Setting up Frontend (public folder)...
cd public
if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
)
if not exist node_modules (
    echo Installing frontend dependencies - this may take a while...
    call npm install
)
cd ..

REM Setup Server (Backend)
echo.
echo Setting up Backend (server folder)...
cd server
if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
)
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
cd ..

REM Start Servers
echo.
echo Starting servers...
start "Backend Server (Port 5000)" cmd /k "cd server && npm start"
start "Frontend Client (Port 3000)" cmd /k "cd public && npm start"

echo.
echo ==========================================
echo Setup complete! 
echo two new windows should have opened for backend and frontend.
echo Please ensure MongoDB is running if backend fails to connect.
echo ==========================================
pause
