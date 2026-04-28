# services/

All business logic lives here. Services are plain async functions — they receive plain data, apply business rules, and return plain typed values.

## Rules
- One file per domain: `<domain>.service.ts`
- Functions receive plain typed inputs and return plain typed outputs
- No `Request` or `Response` types — services must be HTTP-agnostic
- No raw SQL — delegate persistence to a repository layer when it grows
- May call other services (e.g. `notificationService`) for cross-domain side effects
- Must be callable from a CLI script, a test, or a background worker without modification

## Import rules
- May import from: `types/`, `utils/`, `config/`
- Must NOT import from: `routes/`, `controllers/`, `middleware/`
- Must NEVER import `express`
- All relative imports must end in `.js`
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `application.service.ts` |
| Functions | `getAllApplications`, `getApplicationById`, `createApplication` |
| Export | named exports only — no default export |

## Function signature
```ts
export async function actionName(input: InputType): Promise<OutputType>
```

## Template

```ts
import type { Application, CreateApplicationBody } from "../types/application.js";

export async function getAllApplications(): Promise<Application[]> {
  // TODO: fetch from data layer
  return [];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  // TODO: fetch single record by id
  void id;
  return null;
}

export async function createApplication(body: CreateApplicationBody): Promise<Application> {
  // TODO: validate business rules, persist, return created record
  void body;
  throw new Error("Not implemented");
}
```
