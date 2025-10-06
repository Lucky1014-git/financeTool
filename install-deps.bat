@echo off
echo 🛠️ Installing Youth Micro-Investing Platform Dependencies...
echo.

echo 📂 Installing Backend Dependencies...
cd backend
echo Installing Python packages...
pip install flask flask-cors
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies!
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed!
cd ..

echo.
echo 📂 Installing Frontend Dependencies...
cd frontend
echo Installing Node.js packages...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies!
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed!
cd ..

echo.
echo 🎉 Installation complete!
echo.
echo To start the application, run: start-dev.bat
echo.
pause