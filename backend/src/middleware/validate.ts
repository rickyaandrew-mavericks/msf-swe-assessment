import type { Request, Response, NextFunction } from "express";
import type { z, ZodTypeAny, ZodError } from "zod";

function formatZodError(error: ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    const existing = result[key];
    if (existing !== undefined) {
      existing.push(issue.message);
    } else {
      result[key] = [issue.message];
    }
  }
  return result;
}

export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: formatZodError(result.error) });
      return;
    }
    // req.body is typed as `any` — cast is safe here
    req.body = result.data as z.infer<T>;
    next();
  };
}

export function validateQuery<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ errors: formatZodError(result.error) });
      return;
    }
    // Validated — req.query is not re-assigned to preserve ParsedQs type integrity.
    // Controllers read from req.query; schemas for query params should output string values only.
    next();
  };
}

export function validateParams<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ errors: formatZodError(result.error) });
      return;
    }
    // Validated — req.params is not re-assigned to preserve Record<string,string> type integrity.
    next();
  };
}
