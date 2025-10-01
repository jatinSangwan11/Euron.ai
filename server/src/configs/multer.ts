import multer from 'multer';

// In serverless, only /tmp is writable
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp');
  }
});

export const upload = multer({ storage });