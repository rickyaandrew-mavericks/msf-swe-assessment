# config/

Environment-aware configuration. The only place in the codebase that reads `process.env`.

## Rules
- Nothing outside this folder may call `process.env` directly — import from `config/env.ts` instead
- Validate all environment variables at startup — fail fast on misconfiguration
- Export typed named constants, not raw strings
- This folder is a leaf: it imports from `types/` only, never from other src layers

## Import rules
- May import from: `types/` only
- Must NOT import from: `routes/`, `controllers/`, `services/`, `middleware/`, `utils/`
- All relative imports must end in `.js`
- Use `import type` for any type-only import

## Naming
| What | Convention |
|------|-----------|
| File | `env.ts`, `db.ts`, `cors.ts` |
| Exports | named constants: `export const env = { ... } as const` |

## Files to create as the project grows
| File | Purpose |
|------|---------|
| `env.ts` | Read, validate, and re-export all environment variables as typed constants |
| `db.ts` | Database client/pool instance — composed from `env.ts` values |
| `cors.ts` | CORS options object for `app.use(cors(corsOptions))` |

## Template

```ts
// config/env.ts
function required(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv:     optional("NODE_ENV", "development"),
  port:        Number(optional("PORT", "3000")),
  databaseUrl: required("DATABASE_URL"),
} as const;
```
