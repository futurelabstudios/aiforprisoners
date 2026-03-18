#!/bin/bash

# Nyay Setu - Startup Script
echo ""
echo "⚖️  Nyay Setu — Bridge to Justice"
echo "=================================="
echo ""

# Check for API key
if [ -f "server/.env" ]; then
  export $(grep -v '^#' server/.env | xargs)
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ ERROR: GEMINI_API_KEY not found!"
  echo ""
  echo "Steps to fix:"
  echo "1. Copy the example: cp server/.env.example server/.env"
  echo "2. Add your API key to server/.env"
  echo "3. Run this script again"
  echo ""
  exit 1
fi

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing server dependencies..."
  cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing client dependencies..."
  cd client && npm install && cd ..
fi

echo "🚀 Starting Nyay Setu..."
echo ""
echo "📱 Open in browser: http://localhost:5173"
echo "🔧 API server: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start both servers
cd server && node index.js &
SERVER_PID=$!

cd client && npm run dev &
CLIENT_PID=$!

# Handle shutdown
cleanup() {
  echo ""
  echo "Stopping servers..."
  kill $SERVER_PID 2>/dev/null
  kill $CLIENT_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM
wait
