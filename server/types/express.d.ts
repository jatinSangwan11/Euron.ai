import "express";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
      plan?: "Premium" | "Free";
      free_usage?: number;
      auth?: () => Promise<{ userId?: string; has?: (perm: string) => boolean }>;
    }
  }
}
 