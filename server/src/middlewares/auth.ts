// middleware to check userId and check for the premium plan 
import type { NextFunction, Request, Response } from "express";
import { verifyToken } from '@clerk/backend';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('authorization') || req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ')? authHeader.slice(7): undefined;
        if(!token){
            return res.status(401).json({ error: "Missing Bearer token" });
        }
        const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY as string });
        // Attach a Clerk-like auth shim
        // @ts-ignore
        req.userId = decoded.sub || decoded.payload?.sub;
        // @ts-ignore
        req.plan = (decoded.payload?.privateMetadata?.premium || decoded.payload?.publicMetadata?.premium) ? 'Premium' : 'Free';
        // @ts-ignore
        req.free_usage = Number(decoded.payload?.privateMetadata?.free_usage ?? 0);
        // @ts-ignore
        req.auth = async () => ({ userId: req.userId, has: () => false });
        next();
    } catch (error) {
        console.error("auth error::", error);
        res.status(401).json({sucess: false, message: 'Unauthorized'});
    }
}
