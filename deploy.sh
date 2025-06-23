#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel 
echo "Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "Your app is now live on Vercel!"