import type { Request, Response } from "express";
import {OpenAI}  from "openai";
import sql from "../configs/db.ts";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

interface ResponseType {
  success: boolean;
  content?: string;
  message?: string;
  error?: string;
  secure_url?: string;
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
    if(!userId){
      return res.json({
        success: false,
        message: "user id not present"
      })
    }
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
    console.log("content:::", content);

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan === "Free") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    // console.log('req:::', req)
    console.log("content:::", content);
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
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
    const { prompt } = req.body;
    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    // @ts-ignore
    const free_usage = (req.free_usage as number) ?? 0;
    if(!userId){
      return res.json({
        success: false,
        message: "user id not present"
      })
    }
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
      max_tokens: 200,
    });

    const content = response.choices[0]?.message.content ?? "";

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan === "Free") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }
    // console.log('req:::', req)
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const generateImage = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    const { prompt, publish } = req.body;
    // @ts-ignore
    const plan = req.plan;

    // TODO:: here even after having the premium plan, plan is still free in dev not able to test with premuim
    console.log("Plan:::", plan);
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    const formData = new FormData();
    formData.append("prompt", `${prompt}`);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    // we will store this image on cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish)
              VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ?? false
    })`;

    // console.log('req:::', req)
    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const removeImageBackground = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    // @ts-ignore
    const image = req.file as Express.Multer.File | undefined;
    if (!image) {
      return res.json({
        success: false,
        message: "upload the image first",
      });
    }

    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    // we will store this image on cloudinary
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "removal_the_background",
        },
      ],
    });
    await sql`INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    // console.log('req:::', req)
    return res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const removeImageObject = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    const { object } = req.body;
    const image = req.file as Express.Multer.File | undefined;
    if (!image) {
      return res.json({
        success: false,
        message: "upload the image first",
      });
    }

    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    // we will store this image on cloudinary
    const { public_id } = await cloudinary.uploader.upload(image.path);

    const image_url = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, ${`Removed ${object} from image`}, ${image_url}, 'image')`;

    // console.log('req:::', req)
    return res.json({ success: true, content: image_url });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const resumeReview = async (
  req: Request,
  res: Response<Partial<ResponseType>>
): Promise<Response> => {
  try {
    // @ts-ignore
    const { userId } = req.auth ? await req.auth() : {};
    const resume = req.file as Express.Multer.File | undefined;
    if (!resume) {
      return res.json({ success: false, message: "upload the resume first" });
    }
    // @ts-ignore
    const plan = req.plan as "Premium" | "Free";
    if (plan !== "Premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    // @ts-ignore
    if (resume?.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "Upload file less than 5MB" });
    }
    // @ts-ignore
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its
    strengths, weakness, and areas for improvement. Resume content:\n\n${pdfData.text} in less than 700 words`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 700,
    });

    const content = response.choices[0]?.message.content ?? "";

    await sql`INSERT INTO creations (user_id, prompt, content, type)
              VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

    // console.log('req:::', req)
    return res.json({ success: true, content });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    return res.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
