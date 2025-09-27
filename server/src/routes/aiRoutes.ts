import express from 'express';
import { auth } from '../middlewares/auth.ts';
import { generateArticle } from '../controllers/aiController.ts';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);



export default aiRouter;