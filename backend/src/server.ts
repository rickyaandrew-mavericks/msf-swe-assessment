// reflect-metadata must be the very first import — decorator metadata requires it before
// any decorated module (sequelize-typescript models) is evaluated. Do not reorder.
import "reflect-metadata";
import { env } from "./config/env.js";
import { sequelize } from "./config/sequelize.js";
import express from "express";
import type { Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import type { Server } from "net";

async function bootstrap(): Promise<void> {
  await sequelize.authenticate();
  console.log("Database connection established.");

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", db: "connected" });
  });

  app.use(notFound);
  app.use(errorHandler);

  const server: Server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    console.error(`Server failed to start: ${err.message}`);
    process.exit(1);
  });
}

bootstrap().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Startup failed: ${message}`);
  process.exit(1);
});
