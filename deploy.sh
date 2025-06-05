#!/bin/bash

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg
echo "Installing FFmpeg..."
sudo apt-get install -y ffmpeg

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Create necessary directories
echo "Creating project directories..."
mkdir -p uploads videos

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=3000
JWT_SECRET=your_jwt_secret_here
EOL
fi

# Start the application with PM2
echo "Starting the application..."
pm2 start index.js --name "lms-vps"

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
echo "Setting up PM2 startup..."
pm2 startup 