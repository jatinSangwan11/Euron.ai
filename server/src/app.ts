import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectCloudinary from "./configs/cloudinary.js";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRouter.js";

const app = express();

// Health first, independent of Clerk/DB
app.get('/', (req, res) => {
    res.json({ message: "server is working ..." });
});

await connectCloudinary();

app.use(cors());
app.use(express.json());
if (process.env.CLERK_SECRET_KEY) {
    // Lazy-load Clerk only when configured, to avoid bundling/runtime issues
    const { clerkMiddleware, requireAuth } = await import('@clerk/express');
    app.use(clerkMiddleware());
    // Protect all subsequent routes; the root health route stays public
    app.use(requireAuth());
} else {
    console.warn('CLERK_SECRET_KEY not set. Auth middleware is disabled.');
}

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

export default app;


