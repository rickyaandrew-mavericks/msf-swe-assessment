import type { Request, Response, NextFunction } from "express";
import { MAX_FILES, ACCEPTED_MIME, MAX_FILE_BYTES } from "../utils/upload.js";

export function validateFiles(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const files = Array.isArray(req.files) ? req.files : [];

  if (files.length > MAX_FILES) {
    res.status(400).json({
      errors: { documents: [`A maximum of ${MAX_FILES} documents may be uploaded.`] },
    });
    return;
  }

  const errors: string[] = [];
  for (const file of files) {
    if (file.mimetype !== ACCEPTED_MIME) {
      errors.push(`"${file.originalname}" is not a PDF.`);
    }
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`"${file.originalname}" exceeds the 10 MB file size limit.`);
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors: { documents: errors } });
    return;
  }

  next();
}
