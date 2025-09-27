import type { Request, Response } from "express";
import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

interface ResponseType {
  success: boolean;
  content?: string;
  message?: string;
  error?: string;
}

export const generateArticle = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    const { prompt, length } = req.body;
    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    // @ts-ignore
    const free_usage = (req.free_usage as number) ?? 0;

    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: Number(length),
    });

    const content = response.choices[0]?.message.content ?? "";

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan === "Free") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    // console.log('req:::', req)
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error instanceof Error? error.message: error)
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


// NOTE:: here we don;t give a fuck about return cause express only cares about what we send to 
// the http response so res.json({..}) this returns an express Response object

// Response {
//   statusCode: 200,
//   headersSent: true,
//   body: '{"success":true,"content":"Article generated!"}',
//   json: [Function: json],
//   send: [Function: send],
//   status: [Function: status],
//   ... // many other Express/Node internals
// }

// return res.json({ success: true, content: "Article generated!" });

// The return means your function gives back the Response object (the same one shown above).

// But in Express, that return value is ignored — Express doesn’t care. What matters is that the response was sent to the client.

export const generateBlogTitle = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    const { prompt, length } = req.body;
    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    // @ts-ignore
    const free_usage = (req.free_usage as number) ?? 0;

    if (plan !== "Premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: Number(length),
    });

    const content = response.choices[0]?.message.content ?? "";

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan === "Free") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    // console.log('req:::', req)
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error instanceof Error? error.message: error)
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};