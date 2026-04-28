import type { Request, Response, NextFunction } from "express";
import { MAX_FILES, MIN_FILES, ACCEPTED_MIME, MAX_FILE_BYTES } from "../utils/upload.js";

export function validateFiles(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const files = req.files;

  if (!Array.isArray(files) || files.length < MIN_FILES) {
    res.status(400).json({
      errors: { documents: ["At least one PDF document is required."] },
    });
    return;
  }

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
