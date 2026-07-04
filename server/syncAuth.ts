/**
 * Sync Auth Middleware
 *
 * Uses the same SDK authenticateRequest as the tRPC context
 * to extract the user from the session cookie.
 */
import { Request, Response, NextFunction } from "express";
import { sdk } from "./_core/sdk";

export async function syncAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const user = await sdk.authenticateRequest(req);
    (req as any).userId = user?.id || null;
  } catch {
    (req as any).userId = null;
  }
  next();
}
