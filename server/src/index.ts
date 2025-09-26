import express, { type Request, type Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/' ,(req: Request, res: Response) => {
    res.send("server is live")
})

app.use(requireAuth())

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`${PORT} is active and listening`)
})