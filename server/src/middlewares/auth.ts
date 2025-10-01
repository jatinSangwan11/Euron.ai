// middleware to check userId and check for the premium plan 
import type { NextFunction, Request, Response } from "express";
import { clerkClient, getAuth, type User } from "@clerk/express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, has } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user: User = await clerkClient.users.getUser(userId);
        const isPremium = Boolean(
            // @ts-ignore
            user?.privateMetadata?.premium || user?.publicMetadata?.premium || (has && has('premium'))
        );
        // @ts-ignore
        const currentFreeUsage = Number(user?.privateMetadata?.free_usage ?? 0);
        // @ts-ignore
        req.free_usage = isPremium ? 0 : currentFreeUsage;
        // @ts-ignore
        req.plan = isPremium ? 'Premium' : 'Free';
        next();
    } catch (error) {
        console.error("auth error::", error);
        res.status(401).json({sucess: false, message: 'Unauthorized'});
    }
}
