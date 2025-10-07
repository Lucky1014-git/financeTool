@echo off
echo � Starting Flask Backend Only...
echo.

echo 📂 Checking backend directory...
if not exist "backend" (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)

echo ✅ Backend directory found!
echo.

echo � Starting Flask backend...
cd backend
python app.py