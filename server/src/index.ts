import express, { request, type Request, type Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { auth } from "./middlewares/auth.ts";
import { generateArticle } from "./controllers/aiController.ts";
import aiRouter from "./routes/aiRoutes.ts";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/' ,(req, res) => {
    res.json({
        message: "server is working ..."
    })
})
app.use(requireAuth())


app.use('/api/ai', aiRouter );

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`${PORT} is active and listening`)
})