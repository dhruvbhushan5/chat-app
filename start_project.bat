@echo off
cd /d "%~dp0"
echo ==========================================
echo       Setting up Snappy Chat App
echo ==========================================

REM Check for MySQL
echo Checking MySQL service...
sc query MySQL80 >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL80 service not found. Please ensure MySQL is installed and running.
    echo If you use XAMPP or WAMP, start MySQL from its control panel.
) else (
    echo Attempting to start MySQL service...
    net start MySQL80 2>nul
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
echo Creating MySQL database if needed...
call npm run create-db
if %errorlevel% neq 0 (
    echo.
    echo Could not connect to MySQL or create the database.
    echo Start MySQL first, then run this file again.
    pause
    exit /b 1
)
cd ..

REM Start Servers
echo.
echo Starting servers...
start "Backend Server (Port 5000)" cmd /k "cd server && npm run dev"
start "Frontend Client (Port 3000)" cmd /k "cd public && npm start"

echo.
echo ==========================================
echo Setup complete! 
echo two new windows should have opened for backend and frontend.
echo Please ensure MySQL is running if backend fails to connect.
echo ==========================================
pause
