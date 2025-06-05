# LMS Video Processing System

A secure video processing system for Learning Management Systems that handles video uploads, converts them to HLS format, and serves them securely.

## Features

- Secure video upload system
- FFmpeg-based video conversion to HLS format
- Secure video streaming with expiring URLs
- Video.js player integration
- PostgreSQL database for metadata storage
- Docker-based deployment

## Prerequisites

- Ubuntu 20.04 or later
- Node.js 18 or later
- FFmpeg
- PM2 (for process management)

## Deployment Instructions

1. Clone the repository:
```bash
git clone https://github.com/rahulsinghnegiii/lms-vps.git
cd lms-vps
```

2. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

3. Run the deployment script:
```bash
./deploy.sh
```

4. Configure your environment variables in `.env`:
```
PORT=3000
JWT_SECRET=your_secure_jwt_secret
```

5. The application will be running on port 3000 by default.

## Directory Structure

```
lms-vps/
├── uploads/          # Temporary video upload storage
├── videos/          # Processed HLS video files
├── public/          # Static files (Video.js, CSS)
├── index.js         # Main application file
├── deploy.sh        # Deployment script
└── package.json     # Project dependencies
```

## Security Considerations

1. Make sure to set a strong JWT_SECRET in your .env file
2. Configure your firewall to only allow necessary ports
3. Use HTTPS in production
4. Regularly update system packages

## Monitoring

The application is managed by PM2. You can use the following commands:

- View logs: `pm2 logs lms-vps`
- Monitor status: `pm2 status`
- Restart application: `pm2 restart lms-vps`

## License

[Your License] 