import path from "node:path";

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 5;
export const ACCEPTED_MIME = "application/pdf";

// First 5 bytes of every well-formed PDF file: "%PDF-"
export const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);

// baseDir is passed by callers (service/middleware) that have config access,
// keeping this utils module free of config imports per layer rules.
export function applicationUploadDir(baseDir: string, applicationId: string): string {
  return path.resolve(baseDir, applicationId);
}

export function tmpUploadDir(baseDir: string): string {
  return path.resolve(baseDir, "_tmp");
}

// Sanitise a user-supplied filename: strip directory traversal components
// and characters outside word chars, spaces, dots, and hyphens.
// Rejects dot-only names (`.`, `..`) that survive path.basename.
export function safeFilename(original: string): string {
  const base = path.basename(original).replace(/[^\w\s.\-]/g, "_");
  if (/^\.+$/.test(base) || base.length === 0) {
    return "_unnamed.pdf";
  }
  return base;
}

