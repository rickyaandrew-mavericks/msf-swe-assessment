import type { Request, Response, NextFunction } from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
} from "../services/application.service.js";
import type { CreateApplicationBody } from "../utils/applicationSchema.js";

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
