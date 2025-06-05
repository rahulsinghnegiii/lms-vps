const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"]
    }
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const MAX_SIZE = 1 * 1024 * 1024 * 1024; // 1GB
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'video/mp4') {
      return cb(new Error('Only .mp4 files are allowed'));
    }
    cb(null, true);
  }
});

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
  const { course, lesson } = req.body;
  if (!req.file || !course || !lesson) {
    return res.status(400).json({ error: 'Missing file, course, or lesson.' });
  }

  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, 'videos', course, lesson);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate a unique playlist name for each upload
  const baseName = path.parse(req.file.originalname).name;
  const timestamp = Date.now();
  const playlistName = `${baseName}-${timestamp}.m3u8`;
  const outputPath = path.join(outputDir, playlistName);

  ffmpeg(inputPath)
    .outputOptions([
      '-profile:v baseline',
      '-level 3.0',
      '-start_number 0',
      '-hls_time 10',
      '-hls_list_size 0',
      '-f hls'
    ])
    .output(outputPath)
    .on('end', () => {
      res.json({
        message: 'File uploaded and processed successfully.',
        course,
        lesson,
        playlist: playlistName
      });
    })
    .on('error', (err) => {
      console.error('Error processing video:', err);
      res.status(500).send('Error processing video.');
    })
    .run();
});

// Token generation endpoint
app.get('/token', (req, res) => {
  const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '5m' });
  res.json({ token });
});

// Secure streaming endpoint for flexible directory structure
app.get('/stream/:course/:lesson/:filename', (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token && req.query.token) {
    token = req.query.token;
  }
  // For .ts segment requests, check the cookie if no token in query/header
  if (!token && req.cookies && req.cookies.hls_token) {
    token = req.cookies.hls_token;
  }
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(401).send('Invalid or expired token');
    }
    // If this is a .m3u8 playlist request, set a short-lived cookie
    if (req.params.filename.endsWith('.m3u8')) {
      res.cookie('hls_token', token, { httpOnly: true, maxAge: 5 * 60 * 1000 }); // 5 minutes
    }
    next();
  });
}, (req, res) => {
  const { course, lesson, filename } = req.params;
  const filePath = path.join(__dirname, 'videos', course, lesson, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// List all videos for a course and lesson
app.get('/videos/:course/:lesson', (req, res) => {
  try {
    const { course, lesson } = req.params;
    const dirPath = path.join(__dirname, 'videos', course, lesson);
    if (!fs.existsSync(dirPath)) {
      // Always return 200 with an empty array
      return res.json([]);
    }
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.m3u8'));
    res.json(files);
  } catch (err) {
    // On any error, return an empty array
    res.json([]);
  }
});

// Error handler for Multer and other errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 1GB.' });
    }
  } else if (err.message === 'Only .mp4 files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 