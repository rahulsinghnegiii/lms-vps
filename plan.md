# Development Plan for Secure HLS Video Upload & Streaming App

## 1. Project Setup
- Initialize Node.js project (package.json)
- Install dependencies:
  - Express (backend framework)
  - Multer (file uploads)
  - FFmpeg (video processing, via fluent-ffmpeg or similar)
  - jsonwebtoken (token generation)
  - Video.js (frontend video player)
  - dotenv (environment variables)
  - CORS, helmet, morgan (security & logging)
  - Any other required utilities

## 2. Directory Structure
- `/videos/<course>/<lesson>/` for storing processed HLS files
- `/uploads/` for temporary uploaded files (if needed)
- `/public/` for static frontend assets
- `/routes/`, `/controllers/`, `/middleware/` for backend organization

## 3. Backend Implementation
### a. File Upload Endpoint
- POST `/upload`
- Accept single .mp4 file (max 1GB)
- Show upload progress (frontend + backend support)
- Store file temporarily for processing

### b. Video Processing
- After upload, trigger FFmpeg to convert MP4 to HLS (720p)
- Generate `.m3u8` and `.ts` files
- Save output to `/videos/<course>/<lesson>/`
- Handle FFmpeg errors and cleanup

### c. Token Generation
- Generate expiring (5 min) JWT tokens for video access
- Endpoint to request a token for a specific video

### d. Secure Streaming Endpoints
- Serve `.m3u8` and `.ts` files only if a valid token is provided
- Middleware to validate token and expiry
- Prevent direct public access to video files

## 4. Frontend Implementation
### a. Upload Form
- Simple form to upload .mp4 file
- Show progress bar and status messages

### b. Video Player
- Use Video.js to play HLS video
- Fetch secure, tokenized streaming URL from backend
- Handle playback errors (e.g., token expired)

## 5. Security & Error Handling
- Limit file size and type on upload
- Sanitize file paths and user input
- Handle invalid/expired tokens gracefully
- Log errors and important events

## 6. Testing
- Test uploading various MP4 files (including large files)
- Test video processing and playback
- Test token expiry and unauthorized access
- Test on different browsers/devices

## 7. Deployment & Instructions
- Write clear instructions for:
  - Installing dependencies
  - Running the app (dev & prod)
  - Testing upload and playback
  - Required environment variables
- Ensure FFmpeg is installed and accessible on VPS

---

**Next Steps:**
1. Set up project structure and install dependencies.
2. Implement backend upload and processing logic.
3. Build secure streaming and token system.
4. Create frontend upload form and video player.
5. Test end-to-end and document setup. 