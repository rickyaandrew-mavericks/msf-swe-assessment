import { randomUUID } from "node:crypto";
import multer from "multer";
import { env } from "../config/env.js";
import { tmpUploadDir, MAX_FILE_BYTES, MAX_FILES, ACCEPTED_MIME } from "../utils/upload.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tmpUploadDir(env.UPLOAD_DIR));
  },
  filename: (_req, _file, cb) => {
    // Extension hardcoded to .pdf — fileFilter already rejects non-PDFs,
    // so propagating the user-supplied extension is unnecessary and unsafe.
    cb(null, `${randomUUID()}.pdf`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype === ACCEPTED_MIME) {
    cb(null, true);
  } else {
    cb(new Error(`Only PDF files are accepted. Received: ${file.mimetype}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_BYTES,
    files: MAX_FILES,
  },
});

export const uploadDocuments = upload.array("documents", MAX_FILES);
