# Frontend CLAUDE.md

Next.js 16 + React 19 + Tailwind CSS 4 app for the MSF Licensing Portal. See root `CLAUDE.md` for project context and cross-cutting agents.

---

## ⚠️ This is NOT the Next.js you know

**Next.js 16.2.4 contains breaking changes.** APIs, conventions, file structure, and rendering behaviour may all differ from training data. Before writing any Next.js-specific code:

1. Read the relevant guide in `node_modules/next/dist/docs/`
2. Heed deprecation notices in the terminal
3. Do not assume App Router, Pages Router, or middleware behaviour matches prior versions

The same caution applies to **React 19** (concurrent features, new hooks) and **Tailwind CSS 4** (new config format, PostCSS plugin, utility changes).

---

## Tech Stack

| | |
|--|--|
| Framework | Next.js 16.2.4 |
| UI library | React 19.2.4 |
| Styling | Tailwind CSS 4 (PostCSS plugin — `@tailwindcss/postcss`) |
| Language | TypeScript 5, strict mode |
| Module resolution | `moduleResolution: "bundler"`, `module: "esnext"` |
| Path alias | `@/*` → project root |

---

## Project Structure

```
frontend/
├── app/                  # App Router root
│   ├── layout.tsx        # Root layout — fonts, global providers
│   ├── page.tsx          # Home route
│   └── globals.css       # Global styles + Tailwind directives
├── public/               # Static assets
├── next.config.ts        # Next.js config (read docs before modifying)
├── postcss.config.mjs    # Tailwind 4 PostCSS setup
└── tsconfig.json
```

**Planned structure as features grow:**
```
app/
├── (operator)/           # Operator-facing routes (UC1)
│   ├── applications/
│   │   ├── new/          # Submit application
│   │   └── [id]/         # View / resubmit application
├── (officer)/            # Officer-facing routes (UC2)
│   ├── applications/
│   │   └── [id]/         # Review application, provide feedback
├── api/                  # Next.js API routes (thin proxies to backend only)
components/               # Shared UI components
├── ui/                   # Primitive components (Button, Input, Badge)
└── domain/               # Domain-aware components (ApplicationCard, StatusBadge)
lib/                      # Client-side utilities and API fetch helpers
types/                    # Frontend-specific types (API response shapes)
```

---

## Non-Negotiable Rules

1. **Read `node_modules/next/dist/docs/` before using any Next.js API** — behaviour may have changed.
2. **No `any` types** — use `unknown` and narrow explicitly. Strict mode is on.
3. **`import type` for type-only imports** — `isolatedModules` is enabled.
4. **Use `@/` path alias** for all non-relative imports: `import { Button } from "@/components/ui/Button"`.
5. **Server Components by default** — only add `"use client"` when the component genuinely needs browser APIs, event handlers, or state.
6. **Never call the backend DB directly from the frontend** — go through the Express API.
7. **Tailwind 4 uses the PostCSS plugin** — do not add a `tailwind.config.js`; configuration is done via CSS.

---

## Agents

### typescript-reviewer ← USE AFTER EVERY CODE CHANGE
**Trigger**: Any `.ts` or `.tsx` file is written or modified.
**Use for**: Type safety, `import type` compliance, React 19 type patterns, prop type correctness.
**Skip when**: Only config or CSS files changed.
```
Agent({ subagent_type: "typescript-reviewer", prompt: "Review frontend/app/... for type safety and React 19 correctness" })
```

### code-reviewer ← USE AFTER EVERY CODE CHANGE
**Trigger**: Any component, page, or utility is written or modified — run alongside `typescript-reviewer`.
**Use for**: Component structure, accessibility, separation of concerns, Next.js anti-patterns (e.g. unnecessary `"use client"`, data fetching in wrong layer).
**Skip when**: Only `NOTE.md`, documentation, or CSS files changed.
```
Agent({ subagent_type: "code-reviewer", prompt: "Review frontend/app/... for quality and Next.js best practices" })
```

### security-reviewer ← USE WHEN HANDLING USER INPUT OR AUTH
**Trigger**: Any form that accepts user input, any auth flow, any component that renders user-supplied data.
**Use for**: XSS prevention, unsafe HTML rendering, exposed secrets in client bundles, CSRF in form submissions.
**Skip when**: Static display components with no user input.
```
Agent({ subagent_type: "security-reviewer", prompt: "Review frontend/app/(operator)/applications/new for XSS and input handling risks" })
```

### e2e-runner ← USE FOR END-TO-END TESTING
**Trigger**: A critical user flow is complete (e.g. operator submits application, officer reviews and requests changes).
**Use for**: Generating, maintaining, and running E2E tests against the critical UC1 and UC2 flows. Manages flaky tests and uploads artifacts.
**Skip when**: Unit or integration tests are more appropriate (component logic, API responses).
```
Agent({ subagent_type: "e2e-runner", prompt: "Generate E2E test for operator application submission flow" })
```

### performance-optimizer ← USE FOR RENDER OR BUNDLE ISSUES
**Trigger**: Slow page loads, large bundle sizes, excessive re-renders, or unoptimised images.
**Use for**: Server/client component split, lazy loading, image optimisation, render optimisation, bundle analysis.
**Skip when**: No performance concern has been identified.
```
Agent({ subagent_type: "performance-optimizer", prompt: "Analyse frontend/app/(operator)/applications for render performance" })
```

### code-simplifier ← USE AFTER FEATURE IS WORKING
**Trigger**: A feature is complete and tests are passing.
**Use for**: Removing duplication across components, simplifying conditional rendering, extracting reusable hooks.
**Skip when**: Feature is still under active development.
```
Agent({ subagent_type: "code-simplifier", prompt: "Simplify frontend/app/(operator)/applications/new/page.tsx" })
```

### code-architect ← USE WHEN STARTING A NEW SECTION OF THE APP
**Trigger**: Adding a new route group, new domain section, or new shared component system from scratch.
**Use for**: Identifying which files to create, folder structure decisions, component hierarchy design.
**Skip when**: You're adding a new page within an established pattern.
```
Agent({ subagent_type: "code-architect", prompt: "Design the officer review section following patterns in frontend/app/" })
```

### architect ← USE FOR CROSS-CUTTING UI/UX ARCHITECTURE
**Trigger**: Deciding on state management strategy, API data-fetching pattern, auth flow across routes, route group design.
**Use for**: Architectural tradeoffs that affect multiple pages or the whole app.
**Skip when**: Decision is contained to a single component or page.

### planner / Plan ← USE BEFORE IMPLEMENTING A MULTI-PAGE FEATURE
**Trigger**: Any feature that touches more than one route or requires shared state/context.
**Use for**: Breaking down the work into ordered steps before writing code.
**Skip when**: Single-page or clearly scoped change.

### Explore ← USE FOR CODEBASE SEARCH
**Trigger**: You need to find how a component is used, where a pattern is established, or what imports a given module.
**Skip when**: You already know the exact file path — use `Read` directly.

---

## Skills

### `/frontend-patterns`
**Use when**: Building components, deciding on state management, handling data fetching, following Next.js App Router conventions, or managing client/server component boundaries.
**Covers**: React patterns, Next.js App Router, state management, performance optimisation, UI best practices.

### `/coding-standards`
**Use when**: Reviewing component naming, file structure consistency, readability, or establishing prop-naming conventions across the component library.
**Covers**: Naming, readability, immutability, code-quality review.

### `/security-review`
**Use when**: Adding forms, authentication, rendering user-supplied content, or any page with sensitive data (application status, officer comments).
**Covers**: XSS, CSRF, auth patterns, secrets in client bundles, safe HTML rendering.

### `/e2e-testing`
**Use when**: Writing Playwright tests for the operator submission flow (UC1) or officer review flow (UC2). Use with the `e2e-runner` agent.
**Covers**: Page Object Model, Playwright config, CI/CD integration, flaky test strategies, artifact management.

---

## Running the Frontend

```bash
cd frontend
npm run dev     # next dev
npm run build   # next build
npm run lint    # eslint
```

> **Tailwind 4**: Styles are configured via CSS directives, not `tailwind.config.js`. Add custom tokens in `globals.css` using CSS custom properties.

---

## Role-Based Routes

The portal has two actor types with distinct views. Use route groups to separate them cleanly:

| Route group | Actor | Use cases |
|-------------|-------|-----------|
| `(operator)` | Operator | UC1: submit, view status, resubmit |
| `(officer)` | Licensing Officer | UC2: review queue, application detail, feedback |

Both groups share the same auth mechanism but must never render each other's route content. Enforce this at the layout level with role checks.

---

## Status Labels

Operators and officers see different labels for the same internal application state. The frontend must render the correct label based on the authenticated user's role — never the raw internal status string. Refer to the status mapping defined in `entities.json` at the project root.
