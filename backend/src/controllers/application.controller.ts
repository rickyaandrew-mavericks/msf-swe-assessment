import type { Request, Response, NextFunction } from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  createComment,
} from "../services/application.service.js";
import type { CreateApplicationBody, CreateCommentBody } from "../utils/applicationSchema.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getApplicationsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const applications = await getApplications();
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

export async function getApplicationByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"];
    if (typeof id !== "string" || !UUID_RE.test(id)) {
      res.status(404).json({ message: "Application not found." });
      return;
    }
    const application = await getApplicationById(id);
    if (application === null) {
      res.status(404).json({ message: "Application not found." });
      return;
    }
    res.json(application);
  } catch (err) {
    next(err);
  }
}

export async function createApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateApplicationBody;
    const files = Array.isArray(req.files) ? req.files : [];

    const result = await createApplication(body, files);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createCommentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const applicationId = req.params["id"];
    if (typeof applicationId !== "string" || !UUID_RE.test(applicationId)) {
      res.status(404).json({ message: "Application not found." });
      return;
    }

    const body = req.body as CreateCommentBody;
    const result = await createComment(applicationId, body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
