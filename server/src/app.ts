import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from "./configs/cloudinary.ts";
import aiRouter from "./routes/aiRoutes.ts";
import userRouter from "./routes/userRouter.ts";

const app = express();

// Health first, independent of Clerk/DB
app.get('/', (req, res) => {
    res.json({ message: "server is working ..." });
});

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Protect all subsequent routes; the root health route stays public
app.use(requireAuth());

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

export default app;


