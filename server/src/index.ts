import express, { request, type Request, type Response } from "express";
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from "./routes/aiRoutes.ts";
import connectCloudinary from "./configs/cloudinary.ts";
import userRouter from "./routes/userRouter.ts";

const app = express();

await connectCloudinary();

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
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`${PORT} is active and listening`)
// })

export default app;