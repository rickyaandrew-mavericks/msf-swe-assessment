import type { ModelCtor } from "sequelize-typescript";
import { ApplicationModel } from "./application.model.js";
import { ApplicationDocument } from "./applicationDocument.model.js";

// Value imports (not `import type`) — emitDecoratorMetadata requires runtime class references.

export const models: ModelCtor[] = [ApplicationModel, ApplicationDocument];
