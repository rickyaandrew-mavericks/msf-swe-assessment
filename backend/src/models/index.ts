import type { ModelCtor } from "sequelize-typescript";

// `ModelCtor` is a type annotation — `import type` is correct here.
// When adding domain models, import the class as a value (not `import type`)
// because emitDecoratorMetadata requires the class to exist at runtime.
// Example: import { Application } from "./application.model.js";

export const models: ModelCtor[] = [];
