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
// Clerk express middleware removed for Vercel compatibility; using JWT middleware instead

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

export default app;


