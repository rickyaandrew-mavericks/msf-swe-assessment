## Tooling and Task Allocation

This assessment, I utilized Claude Code, orchestrating a multi-agent system where specialized agents (with skills) collaborate based on their designated roles.

### Agents Deployed

`architect`: Designs the high-level system structure, database schemas, and overall application flow.

`code-architect`: Focuses on software design patterns, component hierarchy, and file organization within the codebase.

`code-reviewer`: Reviews code for quality, adherence to standards, logical errors, and potential bugs.

`code-simplifier`: Refactors complex code to improve readability, maintainability, and reduce technical debt.

`database-reviewer`: Evaluates database schemas, queries, migrations, and indexing strategies for performance and data integrity.

`doc-updater`: Ensures all documentation (READMEs, inline comments, API specs) stays current with code changes.

`e2e-runner`: Configures, executes, and analyzes end-to-end testing suites to ensure system reliability.

`performance-optimizer`: Analyzes code execution and database queries to identify bottlenecks and implement efficiency improvements.

`planner`: Breaks down user stories into actionable steps, sequences tasks, and delegates them to specialized agents.

`security-reviewer`: Audits the code and architecture for vulnerabilities, ensuring best practices for authentication, authorization, and data protection.

`tdd-guide`: Drives the Test-Driven Development process, ensuring tests are written before implementation and coverage remains high.

`typescript-reviewer`: Enforces strict TypeScript typing and interface definitions, catching type-related issues before compilation.

### Skills Utilized

`backend-patterns`: Applying standard backend architectural patterns (e.g., RESTful API design, MVC, repository pattern).

`coding-standards`: Enforcing project-specific style guides, linting rules, and naming conventions.

`database-migrations`: Creating, managing, and reviewing safe schema changes and data migrations.

`e2e-testing`: Setting up and writing scenarios for end-to-end testing frameworks.

`frontend-patterns`: Implementing efficient UI state management, component reusability, and reactive rendering patterns.

`gh-cli`: Utilizing the GitHub Command Line Interface for pull request creation, review management, and repository operations.

`git-workflow`: Managing version control, branching strategies, commit hygiene, and merge conflict resolution.

`postgres-patterns`: Applying PostgreSQL-specific optimizations, relational mapping, and advanced querying techniques.

`security-review`: Identifying vulnerabilities like SQL injection, XSS, and insecure direct object references (IDOR).

`ui-ux-pro-max`: Ensuring high-quality, accessible, and intuitive user interfaces and user experiences.

## Examples of Prompts and Instructions Given to the AI

### Prompt Template

```
## Instructions and Procedure
<Generally will tell the planner agent to come out with a plan first>
<To clarify and ask if there are any questions and doubts, no assumptions should be made>
<Can only start working on the code when green light is given by the user>

## Scope
<the scope of files and folders which the AI is going to work on>
<here we also can mention which folder should be strictly not touched>

## Read First
<tell AI to read these files first before working and planning on the feature>

## Task
<all the things and requirements that needs to be done within this user story/ticket>

## Rules
<rules which the AI should strictly follow, such as cannot use type 'any'>

## Edge Cases
<considering some of the edge cases that will happen and how should this edge cases be handled>
```

### Example

```
Let the planner agent come out with a plan on the implementation of this ticket first.
Before execution, i will have to review and approve them first.
Ask me any questions when in doubt on the requirements and feature, do not assume anything.

## Scope
Work on the implementation of frontend and backend of the application.
As long as you follow the folder structure respectively on frontend and backend

## Read First
- CLAUDE.md of each folder (root, backend and frontend) and assign tasks to the respective specialised with the relevant skills agents

## Task
complete this user story
As an Operator, I want to see officer comments displayed prominently at the top of my application so that I immediately understand what needs to be fixed.

New Database Tables: Implement users and comments tables with the following baseline schema. Add or modify columns as technically justified, and document all additions in your plan.
## `users` table
- `id`: UUID, PK, default gen_random_uuid(), NOT NULL
- `username`: STRING(50), UNIQUE, NOT NULL
- `name`: STRING(100), NOT NULL
- `email`: STRING(255), UNIQUE, NOT NULL
- `hash_password`: STRING(255), NOT NULL
- `role`: STRING(30), NOT NULL, CHECK: IN ('operator', 'officer', 'admin')
- `created_at`/`updated_at`: DATE, NOT NULL, default NOW()

## `comments` table
- `id`: UUID, PK, default gen_random_uuid(), NOT NULL
- `officer_id`: UUID, FK → users.id (RESTRICT delete), NOT NULL
- `application_id`: UUID, FK → applications.id (CASCADE delete), NOT NULL
- `comment`: TEXT, NOT NULL
- `created_at`/`updated_at`: DATE, NOT NULL, default NOW()

- Prominent Placement: Render officer comments at the very top of the application detail view, visually distinct from the rest of the form
- Clear Information Display: Each comment must show:
	- Officer's name & role badge
	- Formatted timestamp (localized to user's timezone)
	- Comment text with proper line breaks/whitespace preservation
- Sorting & Ordering: Comments must be ordered chronologically (newest first or oldest first, specify in plan). Provide clear UI indication if multiple comments exist
- Empty State Handling: If no comments exist, display a clean placeholder: "No officer comments yet. Once reviewed, feedback will appear here."
- Unit Testing: Keep tests focused on core functionality, not exhaustive integration

## Output
frontend: should be able to display the status of the application so that user will know the status
enum values of the application status are updated accordingly, referring to the APPLICATION_STATUS const found in backend 20260428000002-create-applications

## Rules
- TypeScript strict, no any

## Edge Cases
- Long Comments: Truncation with "Read more" toggle vs. full display; ensure layout doesn't break
- Multiple Comments: Sorting logic, scroll behavior if list grows long. Right now, display all comments present
```

## Validating and Correcting AI-Generated Output

My workflow for managing AI-generated code is built on a strict two-phase validation system: Pre-Execution Planning and Post-Execution Multi-Agent Review, culminating in a final human check.

### Pre-Execution Planning & Approval Gate

Before any code is written, I instruct the `planner` agent to draft a comprehensive, step-by-step implementation plan. This ensures full alignment on the architecture, scope, and sequence of tasks.

Here is an example of the detailed output the `planner` generates:

```
Implementation Plan: Stripe Subscription Billing

Overview
Add subscription billing with free/pro/enterprise tiers. Users upgrade via Stripe Checkout, and webhook events keep subscription status in sync.

Requirements

Three tiers: Free (default), Pro ($29/mo), Enterprise ($99/mo)

Stripe Checkout for payment flow

Webhook handler for subscription lifecycle events

Feature gating based on subscription tier

Architecture Changes

New table: subscriptions (user_id, stripe_customer_id, stripe_subscription_id, status, tier)

New API route: app/api/checkout/route.ts — creates Stripe Checkout session

New API route: app/api/webhooks/stripe/route.ts — handles Stripe events

New middleware: check subscription tier for gated features

New component: PricingTable — displays tiers with upgrade buttons

Implementation Steps

Phase 1: Database & Backend

1. Create subscription migration: CREATE TABLE subscriptions with RLS policies.

2. Create Stripe webhook handler: Handle checkout.session.completed, customer.subscription.updated, customer.subscription.deleted events.

Phase 2: Checkout Flow
3. Create checkout API route: Create Stripe Checkout session with price_id and success/cancel URLs.
4. Build pricing page: Display three tiers with feature comparison and upgrade buttons.

Phase 3: Feature Gating
5. Add tier-based middleware: Check subscription tier on protected routes, redirect free users.

Testing Strategy

- Unit tests: Webhook event parsing, tier checking logic

- Integration tests: Checkout session creation, webhook processing

- E2E tests: Full upgrade flow (Stripe test mode)

Risks & Mitigations

- Risk: Webhook events arrive out of order → Mitigation: Use event timestamps, idempotent updates.

- Risk: User upgrades but webhook fails → Mitigation: Poll Stripe as fallback, show "processing" state.
```

Once the planner agent submits this proposal, I conduct a manual review. If any requirements are missing or architectural decisions seem flawed, I iterate on the plan with the agent to correct it. The AI is only authorized to begin executing the code once I explicitly approve the finalized plan.

### Post-Execution Multi-Agent Review

After the development phase is complete, the code undergoes a rigorous automated review process before my final manual inspection. I deploy specialized agents to validate different aspects of the codebase based on their domain expertise:

- `code-reviewer` (Quality & Architecture):
  This agent acts as a senior reviewer, proactively evaluating the code for maintainability and established design patterns. It flags overly complex functions, deep nesting, missing error handling, and framework-specific anti-patterns (such as missing React dependency arrays or N+1 query patterns). It filters out noise by only reporting issues with a high confidence rate.

- `database-reviewer` (Schema & Performance):
  Triggered whenever there are migrations or database interactions, this PostgreSQL specialist ensures queries are optimized and schemas are robust. It checks for critical performance issues like missing indexes on foreign keys, ensures proper data types are used, and strictly enforces Row Level Security (RLS) policies and least-privilege access.

- `security-reviewer` (Vulnerability Detection):
  This agent proactively scans for the OWASP Top 10 and other critical security flaws. It hunts for hardcoded secrets, SQL/NoSQL injection vulnerabilities, Cross-Site Scripting (XSS), and broken authentication. It ensures that defense-in-depth principles are applied, user inputs are sanitized, and dependencies are secure.

- `typescript-reviewer` (Type Safety & Async Correctness):
  Acting as a senior TypeScript engineer, this agent enforces strict type safety and idiomatic JavaScript/Node.js patterns. It blocks the abuse of the any type, identifies unhandled promise rejections, catches server/client boundary leaks in Next.js, and ensures asynchronous operations are handled correctly without blocking the event loop.

Once these specialized agents have cleared the code of critical, high, and medium-severity issues, I perform the final human check to verify that the implementation perfectly matches the original user story and business logic.

## Areas where AI was not helpful or produce code that I discard

### Over-Engineering and "Model-Cost-Inducing" Complexity

Sometimes the AI attempts to solve a simple problem with an overly complex design pattern (e.g., using a complex Redux-style reducer for a simple toggle).

- The Issue: The planner and architect agent occasionally over-engineered the process by using tools that are over killing for use case.

- My Action: I rejected these over-engineered snippets during the review of the plan drafted by AI, keeping the codebase lean and maintainable, adhering to the KISS (Keep It Simple, Stupid) principle.

### Hallucinated Library Versions or CSS Framework Quirks

In the frontend, AI occasionally suggests CSS properties or component props that belong to older versions of a library (e.g., Tailwind CSS v2 vs v3) or entirely "hallucinates" a helper utility.

- The Issue: Code that looks correct but fails during the build process because the suggested API doesn't exist in our current package versions.

- My Action: I used the `typescript-reviewer` to catch these early, but ultimately had to manually rewrite the UI logic using the correct documentation for our specific tech stack.
