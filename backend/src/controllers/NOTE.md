# controllers/

The thin layer between the router and the service. Parse the request, call one service function, send the response.

## Rules
- One file per domain: `<domain>.controller.ts`
- Each function: parse `req` → call **one** service method → write `res`
- No business logic, no direct DB access, no multi-service orchestration
- Always `async`, always typed, always `Promise<void>`
- Pass errors to `next(err)` — never swallow them or send raw 500s manually
- Use `sendSuccess` / `sendError` from `utils/http.ts` for all responses

## Import rules
- May import from: `services/`, `utils/`, `types/`
- Must NOT import from: `routes/`, `middleware/`, `config/`
- All relative imports must end in `.js`
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `application.controller.ts` |
| Functions | `listApplications`, `getApplication`, `postApplication` |
| Export | named exports only — no default export |

## Function signature
```ts
export async function actionName(
  req: Request,               // type params: Request<Params, Body, Query>
  res: Response,
  next: NextFunction
): Promise<void>
```

## Template

```ts
import type { Request, Response, NextFunction } from "express";
import type { CreateApplicationBody } from "../types/application.js";
import { sendSuccess } from "../utils/http.js";
import { parseCreateApplicationBody } from "../utils/validate.js";
import { getAllApplications, getApplicationById, createApplication } from "../services/application.service.js";

export async function listApplications(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAllApplications();
    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const application = await getApplicationById(req.params.id);
    if (application === null) { sendSuccess(res, null, 404); return; }
    sendSuccess(res, application);
  } catch (err) {
    next(err);
  }
}

export async function postApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CreateApplicationBody = parseCreateApplicationBody(req.body);
    const application = await createApplication(body);
    sendSuccess(res, application, 201);
  } catch (err) {
    next(err);
  }
}
```
