declare module '@clerk/clerk-sdk-node' {
  import type { Request } from 'express';
  export interface User { [key: string]: any }
  export const clerkClient: any;
  export function getAuth(req: Request): { userId?: string | null; has?: (perm: string) => boolean };
}
