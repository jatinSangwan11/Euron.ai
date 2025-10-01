// middleware to check userId and check for the premium plan 
import type { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.header('x-user-id') || undefined;
        const planHeader = req.header('x-user-plan');
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // @ts-ignore
        req.plan = planHeader === 'Premium' ? 'Premium' : 'Free';
        // @ts-ignore
        req.free_usage = Number(req.header('x-free-usage') || 0);
        next();
    } catch (error) {
        console.error("auth error::", error);
        res.json({sucess: false, message: error});
    }
}
