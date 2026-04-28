# routes/

Wire HTTP method + path to a controller function. Nothing else.

## Rules
- One file per domain: `<domain>.routes.ts`
- Export a configured `Router` instance as the **default export**
- Each route is a single line: `router.get('/:id', getApplication)`
- No `req`/`res` logic, no service calls, no try/catch
- Middleware (auth, validation) is chained inline before the controller: `router.post('/', authMiddleware, postApplication)`
- Mount in `server.ts` under a prefix: `app.use('/api/applications', applicationRouter)`

## Import rules
- May import from: `controllers/`, `middleware/`, `types/`
- Must NOT import from: `services/`, `utils/`, `config/`
- All relative imports must end in `.js` (NodeNext ESM requirement)
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `application.routes.ts` |
| Router variable | `applicationRouter` |
| Export | `export default applicationRouter` |

## Template

```ts
import { Router } from "express";
import { listApplications, getApplication, postApplication } from "../controllers/application.controller.js";

const applicationRouter: Router = Router();

applicationRouter.get("/", listApplications);
applicationRouter.get("/:id", getApplication);
applicationRouter.post("/", postApplication);

export default applicationRouter;
```
