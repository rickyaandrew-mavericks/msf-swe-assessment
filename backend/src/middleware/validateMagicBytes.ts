import fsp from "node:fs/promises";
import type { Request, Response, NextFunction } from "express";
import { PDF_MAGIC } from "../utils/upload.js";

export async function validateMagicBytes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const files = Array.isArray(req.files) ? req.files : [];

  for (const file of files) {
    let valid = false;
    let fd: fsp.FileHandle | undefined;
    try {
      fd = await fsp.open(file.path, "r");
      const buf = Buffer.alloc(5);
      await fd.read(buf, 0, 5, 0);
      valid = buf.equals(PDF_MAGIC);
    } catch {
      // treat read errors as invalid
    } finally {
      await fd?.close().catch(() => undefined);
    }

    if (!valid) {
      // Clean up all temp files for this request before rejecting
      for (const f of files) {
        await fsp.rm(f.path, { force: true }).catch(() => undefined);
      }
      res
        .status(400)
        .json({ errors: { documents: ["Only valid PDF files are accepted."] } });
      return;
    }
  }

  next();
}
