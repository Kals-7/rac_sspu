#!/bin/bash

# 🚀 Rotaract Club SSPU - Deployment Script
# This script helps prepare your project for deployment

echo "🚀 Preparing Rotaract Club SSPU for deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  IMPORTANT: Please edit .env file with your production values!"
    echo "   - Change JWT_SECRET to a secure random string"
    echo "   - Update CORS_ORIGIN to your domain"
else
    echo "✅ .env file already exists"
fi

# Test the build
echo "🧪 Testing the build..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Server is running successfully"
    echo "🌐 Test your site at: http://localhost:3000"
    echo "🔑 Test BOD login with: admin / password"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Your project is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Choose a deployment platform:"
echo "   - Railway (recommended): https://railway.app"
echo "   - Render: https://render.com"
echo "   - Netlify (static only): https://netlify.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "�� Happy deploying!"

