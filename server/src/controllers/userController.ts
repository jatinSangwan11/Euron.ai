import type { Request, Response } from "express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// @ts-ignore
const { getAuth } = require("@clerk/express/cjs");
import sql from "../configs/db.js";


export const getUserCreations = async (req: Request, res: Response) => {
    try{
        if(!sql){
            return res.status(500).json({ success: false, message: "Database not configured (missing DB_URL)" });
        }
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.json({
            success: true,
            creations
        })

    } catch(error) {
        res.json({
            success: false,
            message: error instanceof Error ? error.message: error
        })
    }
}

export const getPublishedCreations = async (req: Request, res: Response) => {
    try{
        if(!sql){
            return res.status(500).json({ success: false, message: "Database not configured (missing DB_URL)" });
        }

        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
        res.json({
            success: true,
            creations
        })

    } catch(error) {
        res.json({
            success: false,
            message: error instanceof Error ? error.message: error
        })
    }
}

export const toogleLikeCreation = async (req: Request, res: Response) => {
    try{
        if(!sql){
            return res.status(500).json({ success: false, message: "Database not configured (missing DB_URL)" });
        }
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const {id} = req.body;
        
        const creationResult = await sql`SELECT * FROM creations WHERE id = ${id}`;
        const creation = Array.isArray(creationResult)
            ? (creationResult as any[])[0]
            : (creationResult as any)?.[0] ?? (creationResult as any)?.rows?.[0];

        if(!creation){
            return res.json({
                success: false,
                message: 'creation not found'
            })
        }

        const currentLikes: string[] = Array.isArray(creation.likes) ? creation.likes : [];
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user: string) => user!==userIdStr)
            message = 'Creation unliked'
        }else {
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        // preparing the array for db update - we make it a string with join as 
        // postgres array literal syntax
        const formattedArray = `{${updatedLikes.join(',')}}`;
        
        await sql`UPDATE creations SET likes = ${formattedArray}::text[] where id = ${id}`;
        
        res.json({
            success: true,
            message
        })

    } catch(error) {
        res.json({
            success: false,
            message: error instanceof Error ? error.message: error
        })
    }
}