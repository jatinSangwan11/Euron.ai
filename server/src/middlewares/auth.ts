// middleware to check userId and check for the premium plan 
import { clerkClient, getAuth, type User } from "@clerk/clerk-sdk-node";
import type { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user: User = await clerkClient.users.getUser(userId);
        const isPremium = Boolean(
            // prefer explicit premium flag in metadata
            // @ts-ignore
            user?.privateMetadata?.premium || user?.publicMetadata?.premium || false
        );
        // @ts-ignore
        const currentFreeUsage = Number(user?.privateMetadata?.free_usage ?? 0);
        if (!isPremium && currentFreeUsage) {
            // @ts-ignore
            req.free_usage = currentFreeUsage;
        } else if (!isPremium && !currentFreeUsage) {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            });
            // @ts-ignore
            req.free_usage = 0;
        }
        // @ts-ignore
        req.plan = isPremium ? 'Premium' : 'Free'
        next();
    } catch (error) {
        console.error("auth error::", error);
        res.json({sucess: false, message: error});
    }
}
