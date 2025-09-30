#!/bin/bash
# Deployment script for EC2
# This script will be run on the EC2 instance to update the application

set -e

echo "🚀 Starting deployment..."

# Navigate to app directory
cd /home/ec2-user/inventory

# Pull latest changes from main branch
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Restart application with PM2
echo "🔄 Restarting application..."
pm2 restart inventory || pm2 start server.js --name inventory

echo "✅ Deployment complete!"
