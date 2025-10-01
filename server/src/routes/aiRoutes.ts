import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground);
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview);

export default aiRouter;


// multer is a middleware for Node.js/Express that makes it easy to handle multipart/form-data, which is the encoding browsers use when uploading files (images, PDFs, etc.).

// 🔹 What happens without multer

// If you post a form with <input type="file"> to your Express server:

// The request body comes in as a stream of bytes in multipart/form-data format.

// Express by default doesn’t know how to parse file uploads.

// You’d have to manually decode the form boundaries, extract file buffers, save them… which is very messy.

// 🔹 What multer does

// Multer:

// Intercepts the request before it hits your route handler.

// Parses multipart/form-data (text fields + file fields).

// Stores the uploaded file(s):

// Either in memory (buffer)

// Or on disk (uploads/ folder)
// depending on your config.

// Puts the info into req.file (for single upload) or req.files (for multiple uploads).