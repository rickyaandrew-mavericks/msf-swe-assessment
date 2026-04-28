import type { Request, Response, NextFunction } from "express";
import { createApplication } from "../services/application.service.js";
import type { CreateApplicationBody } from "../utils/applicationSchema.js";

export async function createApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.body is `any` from Express; validateBody middleware runs before this
    // handler and guarantees the correct shape.
    const body = req.body as CreateApplicationBody;

    // Array.isArray guard: req.files is File[] | { [field]: File[] } | undefined.
    // validateFiles middleware ensures at least one file is present before this runs.
    const files = Array.isArray(req.files) ? req.files : [];

    const result = await createApplication(body, files);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
