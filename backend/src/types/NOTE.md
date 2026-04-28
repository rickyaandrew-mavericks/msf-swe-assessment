# types/

Shared TypeScript interfaces, type aliases, and enums. No runtime logic — type-level constructs only.

## Rules
- Pure type declarations only — every construct is erased at compile time
- No `class` with methods, no runtime values, no `import` from express or node (exception: `express.d.ts` for module augmentation)
- One file per domain: `application.ts`, `review.ts`, `assessment.ts`
- Shared cross-domain primitives go in `common.ts`
- No barrel `index.ts` — import directly from the file (NodeNext + isolatedModules)

## Import rules
- May import from: nothing internal (leaf node — no internal dependencies)
- Exception: `express.d.ts` augments the Express namespace and may reference `express`
- All relative imports must end in `.js`
- Always use `import type` — these files contain types only

## Naming
| What | Convention |
|------|-----------|
| File | `application.ts`, `common.ts`, `express.d.ts` |
| Interfaces | PascalCase: `Application`, `Review` |
| Type aliases | PascalCase: `ApplicationStatus` |
| Enums | Prefer union string literals over `enum` keyword |
| Export | named `export type` / `export interface` only |

## Files to create as the project grows
| File | Purpose |
|------|---------|
| `application.ts` | Application domain interfaces and status types (UC1) |
| `review.ts` | Review domain interfaces and decision types (UC2) |
| `assessment.ts` | Site assessment interfaces (UC3) |
| `user.ts` | User, UserRole, Officer, Operator types |
| `common.ts` | Shared: `ApiResponse<T>`, `PaginatedResponse<T>`, `ErrorBody` |
| `express.d.ts` | Augment `Express.Request` with `.user` typed as `AuthUser` |

## Template

```ts
// types/application.ts
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "pending_resubmission"
  | "approved"
  | "rejected";

export interface Application {
  id: string;
  operatorId: string;
  status: ApplicationStatus;
  submittedAt: string | null; // ISO-8601, null when still draft
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationBody {
  operatorId: string;
  // add fields as the domain grows
}
```

```ts
// types/common.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorBody {
  success: false;
  error: string;
}
```

```ts
// types/express.d.ts  — augments req.user across all controllers
import type { UserRole } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
```
