import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_root";
      const existing = errors[key];
      if (existing !== undefined) {
        existing.push(issue.message);
      } else {
        errors[key] = [issue.message];
      }
    }
    res.status(400).json({ errors });
    return;
  }

  const isDev = env.NODE_ENV === "development";

  if (err instanceof Error) {
    res.status(500).json({
      message: "Internal server error",
      ...(isDev ? { detail: err.message, stack: err.stack } : {}),
    });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
}
