# middleware/

Cross-cutting request concerns. One concern per file.

## Rules
- One file per concern: `<purpose>.middleware.ts`
- Export named functions or factory functions — no default exports
- Error handlers must use the four-parameter signature `(err, req, res, next)` — Express 5 identifies error handlers this way
- Register `notFound.ts` and `errorHandler.ts` last in `server.ts`, in that order
- Never import from `controllers/` or `routes/`

## Import rules
- May import from: `utils/`, `types/`, `config/`
- May import from `services/` only for auth (e.g. verifying a session token)
- Must NOT import from: `controllers/`, `routes/`
- All relative imports must end in `.js`
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `errorHandler.ts`, `notFound.ts`, `auth.middleware.ts`, `role.middleware.ts` |
| Export | named function or factory: `export function errorHandler(...)` / `export const requireRole = (role) => (req, res, next) => {}` |

## Files to create as the project grows
| File | Purpose |
|------|---------|
| `errorHandler.ts` | Central error handler — must be last `app.use()` in server.ts |
| `notFound.ts` | 404 catch-all — registered just before `errorHandler` |
| `auth.middleware.ts` | Verify JWT/session, attach typed `req.user` |
| `role.middleware.ts` | `requireRole('operator' \| 'officer')` factory |
| `validate.middleware.ts` | Schema validation factory — wraps Zod or manual guards |

## Template

```ts
// middleware/errorHandler.ts — register LAST in server.ts
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/http.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  console.error(err);
  sendError(res, message, 500);
}
```

```ts
// middleware/notFound.ts — register second-to-last in server.ts
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/http.js";

export function notFound(_req: Request, res: Response, _next: NextFunction): void {
  sendError(res, "Route not found", 404);
}
```

```ts
// middleware/role.middleware.ts — factory pattern
import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/user.js";
import { sendError } from "../utils/http.js";

export const requireRole = (role: UserRole) => (_req: Request, res: Response, next: NextFunction): void => {
  // TODO: check req.user.role against required role
  void role;
  next();
};
```
