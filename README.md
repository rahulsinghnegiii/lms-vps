# Secure HLS Video Upload & Streaming App

This is a full-stack Node.js application that allows users to upload MP4 videos, convert them to HLS format, and stream them securely using token-based authentication.

## Prerequisites

- Node.js (v14 or higher)
- FFmpeg installed on your system

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

## Running the App

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the specified port (default: 3000).

## Testing

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the upload form to select and upload an MP4 file (max 1GB).
3. Monitor the upload progress and status messages.
4. After successful upload, the video will be processed and converted to HLS format.
5. Use the Video.js player to stream the converted video securely.

## Security

- The app uses token-based authentication for secure streaming.
- Tokens expire after 5 minutes.
- Direct access to `.m3u8` and `.ts` files is prevented without a valid token.

## License

This project is licensed under the MIT License. 