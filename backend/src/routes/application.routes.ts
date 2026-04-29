import { Router } from "express";
import { uploadDocuments } from "../middleware/upload.js";
import { validateMagicBytes } from "../middleware/validateMagicBytes.js";
import { validateBody } from "../middleware/validate.js";
import { validateFiles } from "../middleware/validateFiles.js";
import {
  createApplicationHandler,
  getApplicationsHandler,
  getApplicationByIdHandler,
  createCommentHandler,
} from "../controllers/application.controller.js";
import {
  createApplicationSchema,
  createCommentSchema,
} from "../utils/applicationSchema.js";

const router = Router();

router.get("/", getApplicationsHandler);
router.get("/:id", getApplicationByIdHandler);

// Order is critical: multer first to parse body+files, then magic byte check
// before any business logic runs.
router.post(
  "/",
  uploadDocuments,
  validateMagicBytes,
  validateBody(createApplicationSchema),
  validateFiles,
  createApplicationHandler,
);

router.post(
  "/:id/comments",
  validateBody(createCommentSchema),
  createCommentHandler,
);

export default router;
