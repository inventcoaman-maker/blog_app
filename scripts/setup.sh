#!/bin/bash

# Blog Project Setup Script
# This script sets up the development environment

set -e

echo "================================"
echo "Blog Project Setup"
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python and Node.js found"

# Backend Setup
echo ""
echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

echo "✅ Backend setup complete"

# Frontend Setup
echo ""
echo "Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

echo "✅ Frontend setup complete"

echo ""
echo "================================"
echo "Setup Complete! 🎉"
echo "================================"
echo ""
echo "To start development:"
echo "1. Run 'npm run dev' in the root directory"
echo ""
echo "Or run individually:"
echo "- Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "- Frontend: cd frontend && npm run dev"
echo ""