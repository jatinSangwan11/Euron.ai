// middleware to check userId and check for the premium plan 
import { clerkClient, getAuth, type User } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, has } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user: User = await clerkClient.users.getUser(userId);
        if (has && !has("premium") && user && user.privateMetadata.free_usage) {
            // @ts-ignore
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            // @ts-ignore
            req.free_usage = 0;
        }
        // @ts-ignore
        req.plan = has("premium")? 'Premium': 'Free'
        next();
    } catch (error) {
        console.error("auth error::", error);
        res.json({sucess: false, message: error});
    }
}
