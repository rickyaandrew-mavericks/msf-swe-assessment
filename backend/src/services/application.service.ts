import { randomUUID } from "node:crypto";
import fsp from "node:fs/promises";
import path from "node:path";
import { sequelize } from "../config/sequelize.js";
import { env } from "../config/env.js";
import { ApplicationModel } from "../models/application.model.js";
import { ApplicationDocument } from "../models/applicationDocument.model.js";
import { applicationUploadDir, safeFilename } from "../utils/upload.js";
import type { CreateApplicationBody } from "../utils/applicationSchema.js";
import type { ApplicationDocumentMetadata } from "../types/application.js";

export type CreateApplicationResult = {
  id: string;
  status: string;
  createdAt: Date;
};

export async function createApplication(
  body: CreateApplicationBody,
  files: Express.Multer.File[]
): Promise<CreateApplicationResult> {
  const id = randomUUID();
  const uploadDir = applicationUploadDir(env.UPLOAD_DIR, id);

  await fsp.mkdir(uploadDir, { recursive: true });

  const docMetas: ApplicationDocumentMetadata[] = [];
  const tempPaths: string[] = files.map((f) => f.path);

  // Move files from _tmp to the application directory before the transaction,
  // so that the paths stored in the DB are the final canonical paths.
  const usedFilenames = new Set<string>();
  for (const file of files) {
    // Deduplicate within this upload batch to prevent overwriting a file with
    // the same sanitised name (e.g. two files both called "doc.pdf").
    let filename = safeFilename(file.originalname);
    if (usedFilenames.has(filename)) {
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      let i = 1;
      while (usedFilenames.has(`${base}_${i}${ext}`)) { i++; }
      filename = `${base}_${i}${ext}`;
    }
    usedFilenames.add(filename);

    const dest = path.join(uploadDir, filename);
    try {
      await fsp.rename(file.path, dest);
    } catch (err) {
      // rename fails across devices (EXDEV) — fall back to copy + delete
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === "EXDEV") {
        await fsp.copyFile(file.path, dest);
        await fsp.rm(file.path, { force: true });
      } else {
        throw err;
      }
    }
    docMetas.push({
      // Store the safeFilename output (already stripped to [\w\s.\-]) as the
      // display name and a relative path so the DB is not coupled to the
      // server's absolute upload directory.
      originalName: filename,
      storedPath: path.join(id, filename),
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });
  }

  const transaction = await sequelize.transaction();
  try {
    const application = await ApplicationModel.create(
      {
        id,
        fullName: body.fullName,
        nricOrPassport: body.nricOrPassport,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        nationality: body.nationality,
        contactNumber: body.contactNumber,
        email: body.email,
        homeAddress: body.homeAddress,
        businessName: body.businessName,
        businessAddress: body.businessAddress,
        yearsInOperation: body.yearsInOperation,
        licenceType: body.licenceType,
        declarationAccuracy: body.declarationAccuracy,
        declarationConsent: body.declarationConsent,
        status: "submitted",
      },
      { transaction }
    );

    await ApplicationDocument.bulkCreate(
      docMetas.map((d) => ({
        applicationId: id,
        originalName: d.originalName,
        storedPath: d.storedPath,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
      })),
      { transaction }
    );

    await transaction.commit();

    return {
      id: application.id,
      status: application.status,
      createdAt: application.createdAt,
    };
  } catch (err) {
    await transaction.rollback();
    // Best-effort cleanup — remove files already moved to the application directory
    await fsp.rm(uploadDir, { recursive: true, force: true });
    throw err;
  } finally {
    // Clean up any temp files that were not successfully moved
    for (const tmpPath of tempPaths) {
      await fsp.rm(tmpPath, { force: true }).catch(() => undefined);
    }
  }
}
