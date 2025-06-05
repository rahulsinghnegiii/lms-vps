Context for Cursor AI:
I want to build a simple full-stack Node.js application to run on a VPS (no external cloud storage or services like AWS or S3). The app should allow users to upload a single MP4 video file up to 1GB. After uploading, the server must convert the video to HLS format (720p resolution) using FFmpeg, generating the .m3u8 playlist and .ts segment files. The converted video should be saved in a structured folder system like /videos/course1/lesson1/ on the VPS filesystem.

The frontend must include a video player implemented with Video.js that streams the HLS video securely. The video streaming should use temporary, expiring tokens or URLs valid for 5 minutes, preventing unauthorized direct access to the .m3u8 or .ts files.

The backend must handle uploads, video processing, token generation, and secure streaming. The entire system should work fully on the VPS with no reliance on external cloud storage or services.

Prompt for Cursor AI:
Create a Node.js + Express application with the following features:

Upload form:

Simple frontend form allowing users to upload a single .mp4 file (up to 1GB).

Show upload progress and status messages.

Video processing:

After upload, use FFmpeg to convert the MP4 to HLS format at 720p resolution.

Generate the .m3u8 playlist and .ts segment files.

Save the output files under a structured directory like /videos/course1/lesson1/ on the VPS.

Secure streaming:

Use token-based authentication for streaming URLs.

Tokens should expire after 5 minutes.

Prevent direct public access to .m3u8 and .ts files without a valid token.

Video playback:

Implement a video player on the frontend using Video.js.

The player should use the secure tokenized URLs to stream the converted HLS video.

Additional requirements:

No external cloud storage or third-party services like AWS or S3.

Must work entirely on the VPS filesystem.

Handle errors and edge cases like large file uploads and invalid tokens.

Provide clear instructions on how to install dependencies, run the app, and test uploading and playback.