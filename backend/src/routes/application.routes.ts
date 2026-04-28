import { Router } from "express";
import { uploadDocuments } from "../middleware/upload.js";
import { validateMagicBytes } from "../middleware/validateMagicBytes.js";
import { validateBody } from "../middleware/validate.js";
import { validateFiles } from "../middleware/validateFiles.js";
import { createApplicationHandler } from "../controllers/application.controller.js";
import { createApplicationSchema } from "../utils/applicationSchema.js";

const router = Router();

// Order is critical: multer first to parse body+files, then magic byte check
// before any business logic runs.
router.post(
  "/",
  uploadDocuments,
  validateMagicBytes,
  validateBody(createApplicationSchema),
  validateFiles,
  createApplicationHandler
);

export default router;
