# utils/

Stateless, domain-agnostic helper functions. Zero side effects, zero I/O.

## Rules
- Every function must be a pure helper — same input always produces same output
- No DB access, no HTTP calls, no logger writes
- If a helper is specific to one domain, it belongs in that domain's service — not here
- Every util must be unit-testable with zero mocks

## Import rules
- May import from: `types/` only
- Must NOT import from: `routes/`, `controllers/`, `services/`, `middleware/`, `config/`
- Must NEVER import `express` (exception: `utils/http.ts` may import `Response` for the helper signature)
- All relative imports must end in `.js`
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `http.ts`, `validate.ts`, `statusTransitions.ts`, `dateHelpers.ts` |
| Functions | camelCase named exports — no default export |

## Files to create as the project grows
| File | Purpose |
|------|---------|
| `http.ts` | `sendSuccess(res, data)` / `sendError(res, msg, status)` response helpers |
| `validate.ts` | Runtime request body guards — parse unknown → typed or throw |
| `statusTransitions.ts` | Pure: `canTransition(from, to, role): boolean` — state machine logic |
| `dateHelpers.ts` | Date formatting and calculation helpers |
| `idGenerator.ts` | Generate human-readable reference numbers e.g. `APP-2026-00001` |

## Template

```ts
// utils/http.ts
import type { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function sendError(res: Response, message: string, status = 500): void {
  res.status(status).json({ success: false, error: message });
}
```

```ts
// utils/validate.ts — one guard per domain body type
import type { CreateApplicationBody } from "../types/application.js";

export function parseCreateApplicationBody(raw: unknown): CreateApplicationBody {
  if (
    typeof raw !== "object" ||
    raw === null ||
    typeof (raw as Record<string, unknown>)["operatorId"] !== "string"
  ) {
    throw new Error("Invalid request body");
  }
  return { operatorId: (raw as Record<string, unknown>)["operatorId"] as string };
}
```
