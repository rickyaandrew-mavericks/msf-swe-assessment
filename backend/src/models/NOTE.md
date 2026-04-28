# models/

Sequelize-TypeScript model definitions. One file per domain entity.

## Layer rules
- May import from: `types/`, `config/`, other files in `models/`
- Must NOT import from: `routes/`, `controllers/`, `services/`, `middleware/`, `utils/`
- `services/` is allowed to import from `models/`

## Critical: decorator metadata imports

`emitDecoratorMetadata` emits class references at runtime. Any model class used in a
decorator (e.g. `@ForeignKey(() => User)`, `@BelongsTo(() => Application)`) **must be
imported as a value**, never as `import type`.

```ts
// Correct — runtime reference preserved
import { User } from "./user.model.js";

// Wrong — stripped at compile time, decorator metadata breaks
import type { User } from "./user.model.js";
```

## Naming conventions
| What | Convention |
|------|-----------|
| File | `<entity>.model.ts` (e.g. `application.model.ts`) |
| Class | PascalCase singular (e.g. `Application`) |
| Table | snake_case plural via `@Table({ tableName: "applications" })` |
| Column | camelCase property, snake_case column via `underscored: true` in `database.ts` |

## Registering a new model
Add the import and push to `models` array in `models/index.ts`.
Do NOT use `import type` for the model class.

## Template

```ts
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "examples", timestamps: true })
export class Example extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;
}
```
