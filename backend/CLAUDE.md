# Backend CLAUDE.md

Express 5 + TypeScript API for the MSF Licensing Portal. See root `CLAUDE.md` for project context and cross-cutting agents.

---

## Tech Stack

| | |
|--|--|
| Runtime | Node.js (ESM — `"type": "module"`) |
| Framework | Express 5 |
| Language | TypeScript 6, strict mode |
| Module system | `module: "nodenext"`, `verbatimModuleSyntax: true` |
| Key tsconfig flags | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `isolatedModules` |

---

## Non-Negotiable Rules

These apply to every file in this workspace. Violations will be caught by `typescript-reviewer`.

1. **`.js` extensions on all relative imports** — even when the source file is `.ts`. Required by NodeNext ESM.
   ```ts
   import { createApplication } from "../services/application.service.js"; // correct
   import { createApplication } from "../services/application.service";    // wrong — breaks at runtime
   ```

2. **`import type` for type-only imports** — required by `verbatimModuleSyntax`.
   ```ts
   import type { Application } from "../types/application.js"; // correct
   import { Application } from "../types/application.js";      // wrong — build error
   ```

3. **No `require()`, no `__dirname`, no `__filename`** — use `import.meta.url` with `fileURLToPath` if path resolution is needed.

4. **Named exports only** — no `export default` except in `routes/` (router instances).

5. **No `any` types** — use `unknown` and narrow explicitly.

6. **Array index access returns `T | undefined`** — handle it. `noUncheckedIndexedAccess` is on.

---

## Folder Structure & Layer Rules

```
src/
├── config/       ← only place that reads process.env
├── types/        ← interfaces, enums, express augmentation — no runtime code
├── middleware/   ← errorHandler, notFound, auth, role guards
├── utils/        ← pure stateless helpers
├── services/     ← all business logic — no req/res, no express imports
├── controllers/  ← parse req → call one service → send res
├── routes/       ← HTTP method + path → controller, nothing else
└── server.ts     ← app bootstrap
```

Each folder has a `NOTE.md` with the full standard — read it before adding files.

**Layer import rules (strict):**

| Layer | May import from |
|-------|----------------|
| `routes` | `controllers`, `middleware`, `types` |
| `controllers` | `services`, `utils`, `types` |
| `services` | `utils`, `types`, `config` |
| `middleware` | `utils`, `types`, `config` (+ `services` for auth only) |
| `utils` | `types` only |
| `types` | nothing |
| `config` | `types` only |

---

## Agents

### typescript-reviewer ← USE AFTER EVERY CODE CHANGE
**Trigger**: Any `.ts` file is written or modified.
**Use for**: Type safety, async correctness, `import type` compliance, `.js` extension checks, `noUncheckedIndexedAccess` violations.
**Skip when**: Only config files (`.json`, `.mjs`) changed.
```
Agent({ subagent_type: "typescript-reviewer", prompt: "Review backend/src/... for type safety and ESM correctness" })
```

### code-reviewer ← USE AFTER EVERY CODE CHANGE
**Trigger**: Any code is written or modified — run alongside `typescript-reviewer`.
**Use for**: Code quality, security, maintainability, layer boundary violations, naming conventions.
**Skip when**: Only `NOTE.md` or documentation files changed.
```
Agent({ subagent_type: "code-reviewer", prompt: "Review backend/src/... for quality and layer boundary compliance" })
```

### security-reviewer ← USE WHEN HANDLING USER INPUT OR AUTH
**Trigger**: Adding auth middleware, any endpoint that accepts user input, status transition logic, session/token handling.
**Use for**: OWASP Top 10, injection risks, insecure role checks, exposed internal state (e.g. approval stage leaking to operators).
**Skip when**: Purely internal utility functions with no user-facing surface.
```
Agent({ subagent_type: "security-reviewer", prompt: "Review backend/src/middleware/auth.middleware.ts for auth vulnerabilities" })
```

### database-reviewer ← USE WHEN WRITING QUERIES OR MIGRATIONS
**Trigger**: Any SQL, ORM query, schema change, or migration file.
**Use for**: Query optimisation, index design, N+1 detection, migration safety, zero-downtime schema changes.
**Skip when**: No database interaction in the changed files.
```
Agent({ subagent_type: "database-reviewer", prompt: "Review this migration for safety and index strategy" })
```

### code-architect ← USE WHEN STARTING A NEW DOMAIN FEATURE
**Trigger**: Adding a new domain (e.g. `review`, `assessment`) from scratch.
**Use for**: Identifying which files to create, in what order, following existing `NOTE.md` patterns.
**Skip when**: The pattern is established and you're just adding another method to an existing service.
```
Agent({ subagent_type: "code-architect", prompt: "Design the review domain — routes, controller, service, types — following patterns in backend/src/" })
```

### performance-optimizer ← USE WHEN ROUTES FEEL SLOW
**Trigger**: Identified bottleneck, high-latency endpoint, memory leak suspicion, or large dataset handling.
**Use for**: Query optimisation, response caching, payload size, algorithmic improvements.
**Skip when**: No performance concern has been identified.
```
Agent({ subagent_type: "performance-optimizer", prompt: "Analyse backend/src/services/application.service.ts for bottlenecks" })
```

### code-simplifier ← USE AFTER FEATURE IS WORKING
**Trigger**: A feature is complete and working.
**Use for**: Removing duplication, simplifying logic, improving readability without changing behaviour.
**Skip when**: Code is still under active development or tests are not yet passing.
```
Agent({ subagent_type: "code-simplifier", prompt: "Simplify backend/src/controllers/application.controller.ts" })
```

### architect ← USE FOR CROSS-LAYER DESIGN DECISIONS
**Trigger**: Designing the status transition state machine, deciding on session strategy, evaluating DB schema design.
**Use for**: Architectural tradeoffs, scalability decisions, patterns that affect multiple layers.
**Skip when**: The decision is contained to a single file.

### planner / Plan ← USE BEFORE IMPLEMENTING A MULTI-STEP FEATURE
**Trigger**: Any feature that touches more than 2 layers or 3+ files.
**Use for**: Breaking the work into ordered steps, identifying risk, aligning on approach before writing code.
**Skip when**: Single-file or clearly scoped change.

### Explore ← USE FOR CODEBASE SEARCH
**Trigger**: You need to find where something is implemented, how a pattern is used, or what imports a given module.
**Skip when**: You already know the exact file path — use `Read` directly.

---

## Skills

### `/backend-patterns`
**Use when**: Designing API routes, deciding on error handling strategy, structuring middleware, or following REST conventions.
**Covers**: Node.js/Express patterns, API design, route organisation, error propagation.

### `/coding-standards`
**Use when**: Reviewing naming conventions, readability, immutability patterns, or establishing consistent code style across service/controller files.
**Covers**: Naming, readability, immutability, code-quality review.

### `/security-review`
**Use when**: Adding any authentication, user input handling, secrets management, or API endpoints that change application state.
**Covers**: Auth patterns, input validation, secrets handling, OWASP Top 10.

### `/postgres-patterns`
**Use when**: Designing the database schema, writing queries, adding indexes, or planning for performance at scale.
**Covers**: Query optimisation, schema design, indexing strategy, row-level security.

### `/database-migrations`
**Use when**: Adding, modifying, or removing database tables or columns.
**Covers**: Zero-downtime migrations, rollback strategies, Prisma/Drizzle/Kysely patterns.

### `/typescript-reviewer` (agent, invoked as Agent tool)
Referenced above under Agents — this is the agent, not a slash command skill.

---

## Running the Backend

```bash
cd backend
npm run dev       # nodemon with ts-node ESM
npm run build     # tsc -p .
npm run start     # node dist/server.js
```

> If `dev` fails with ESM errors, ensure `package.json` has `"type": "module"` and add to `package.json`:
> ```json
> "ts-node": { "esm": true }
> ```

---

## Adding a New Domain (e.g. `review`)

Follow this order — each step builds on the previous:

1. `src/types/review.ts` — define `Review`, `ReviewStatus`, `CreateReviewBody`
2. `src/services/review.service.ts` — business logic, no express imports
3. `src/controllers/review.controller.ts` — parse → service → respond
4. `src/routes/review.routes.ts` — mount controller methods on router
5. `src/server.ts` — `app.use('/api/reviews', reviewRouter)`

Run `typescript-reviewer` and `code-reviewer` agents after each step.
