@echo off
echo 🚀 Starting Youth Micro-Investing Platform...
echo.

echo 📂 Checking directories...
if not exist "backend" (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Frontend directory not found!
    pause
    exit /b 1
)

echo ✅ Directories found!
echo.

echo 🐍 Starting Flask backend...
cd backend
start "Flask Backend" cmd /k "python app.py"
cd ..

echo ⏳ Waiting for backend to start...
ping -n 4 127.0.0.1 > nul

echo ⚛️ Starting React frontend...
cd frontend
start "React Frontend" cmd /k "npm start"
cd ..

echo.
echo ✅ Both servers starting!
echo 📊 Backend API: http://localhost:5000
echo 🌐 Frontend App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul