@echo off
REM Blog Project Setup Script for Windows
REM This script sets up the development environment

echo ================================
echo Blog Project Setup
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

echo ✅ Python and Node.js found

REM Backend Setup
echo.
echo Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Run migrations
echo Running database migrations...
python manage.py migrate

echo ✅ Backend setup complete

REM Frontend Setup
echo.
echo Setting up frontend...
cd ..\frontend

REM Install dependencies
echo Installing Node dependencies...
npm install

echo ✅ Frontend setup complete

echo.
echo ================================
echo Setup Complete! 🎉
echo ================================
echo.
echo To start development:
echo 1. Run 'npm run dev' in the root directory
echo.
echo Or run individually:
echo - Backend: cd backend && venv\Scripts\activate.bat && python manage.py runserver
echo - Frontend: cd frontend && npm run dev
echo.