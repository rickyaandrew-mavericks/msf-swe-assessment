# MSF Licensing Portal — Root CLAUDE.md

## Project Overview

Government licensing portal for the Ministry of Social and Family Development (MSF). The system manages licence applications through three use cases:

- **UC1 — Operator Submission**: Operators submit and resubmit licence applications with targeted officer feedback.
- **UC2 — Officer Review**: Licensing Officers review applications, provide structured feedback, and manage status transitions.
- **UC3 — Site Assessment**: Officers conduct on-site inspections, flag checklist items, and operators respond to flagged items only.

**MVP scope**: UC1 + UC2 fully, UC3 deferred. See GitHub Project #1 for all 45 user stories with priority labels.

**Two workspaces**: `backend/` (Express API) and `frontend/` (Next.js app). Each has its own `CLAUDE.md` with workspace-specific agent and skill guidance. This root file covers project-wide tooling and cross-cutting concerns only.

---

## Monorepo Structure

```
msf-swe-assessment/
├── backend/          # Express 5 + TypeScript API
├── frontend/         # Next.js 16 + React 19 + Tailwind 4
├── entities.json     # Domain entity definitions
├── SCOPE.md          # Delivery scope decisions
└── CLAUDE.md         # ← you are here
```

---

## Cross-Cutting Agents

These agents apply at the project level — use them when the task spans both workspaces or involves architecture/planning.

### architect
**Use when**: Planning new features, making architectural decisions, evaluating tradeoffs across the stack, designing the state machine for application status transitions.
**Skip when**: The task is contained to a single file or routine implementation within an established pattern.
```
Agent({ subagent_type: "architect", prompt: "..." })
```

### planner / Plan
**Use when**: Breaking down a multi-step feature before implementation (e.g. "implement the resubmission flow end-to-end"). Use `Plan` for lighter planning; `planner` for complex feature design.
**Skip when**: The task is a single, clearly scoped change.

### code-architect
**Use when**: Starting a new domain feature and need to know which files to create, in what order, following existing codebase conventions.
**Skip when**: The pattern already exists and you're just adding a new domain (follow the NOTE.md templates).

### Explore
**Use when**: You need to find a file, symbol, or pattern across the codebase quickly. Prefer this over manual `grep` for open-ended searches.
**Thoroughness levels**: `quick` (keyword search), `medium` (moderate), `very thorough` (comprehensive).

### general-purpose
**Use when**: A multi-step research task doesn't fit another agent type, or you need to search for something you're not confident you'll find in one try.

---

## GitHub & Git Skills

### `/gh-cli`
Use for all GitHub operations: creating/managing issues, PRs, project board items, labels, and releases. All 45 user stories live in GitHub Project #1.

**Common tasks:**
```bash
# View MVP issues (Priority: Highest)
gh issue list --label "Priority: Highest" --repo rickyaandrew-mavericks/msf-swe-assessment

# Add a new story to the project
gh issue create --title "..." --label "UC1: Operator Submission,operator" --repo rickyaandrew-mavericks/msf-swe-assessment
gh project item-add 1 --owner @me --url <issue-url>

# Review a PR
gh pr view <number> --comments
```

### `/git-workflow`
Use when making branching decisions, resolving conflicts, or establishing commit conventions for this repo.

**Branch convention**: `feature/<issue-number>-short-description` (e.g. `feature/2-application-form`)
**Commit convention**: `<type>(<scope>): <description>` — e.g. `feat(applications): add submission endpoint`

---

## Tooling & Claude Code Skills

### `/update-config`
Use to add permissions, set environment variables, or configure automated hooks in `.claude/settings.json`.
```
# Examples: "allow npm run dev", "set DATABASE_URL=...", "when Claude stops show git status"
```

### `/fewer-permission-prompts`
Use after a working session to scan transcripts and add common read-only commands to the allowlist, reducing repeated permission prompts.

### `/loop`
Use to run a prompt or slash command repeatedly on an interval. Useful for watching a build, polling a service, or iterating on a task.

### `/schedule`
Use to schedule a one-time or recurring remote agent run (e.g. "run security review every Monday", "check PR status at 3pm").

### `/find-skills`
Use when you need functionality that might exist as an installable skill. Ask: "is there a skill for X?"

### `/init`
Use to generate a new `CLAUDE.md` for a new workspace or sub-directory.

---

## Memory Skills (MemPalace)

### `/mempalace:status`
Check the current state of the memory palace — wings, rooms, drawer counts.

### `/mempalace:search`
Search memories semantically across wings/rooms.

### `/mempalace:mine`
Mine project files or conversation exports into the memory palace.

### `/mempalace:init`
Set up MemPalace for the first time — install, initialise, configure MCP server.

### `/mempalace:help`
Full reference for all MemPalace skills, MCP tools, and CLI commands.

---

## Security — Project-Wide Rules

- Never commit `.env` files. Use `.env.example` with placeholder values.
- Operators and Officers must never see each other's role-specific data.
- The internal approval stage must never be exposed to operators at any point (see UC3 constraint #39).
- All status transitions must follow the defined state machine — no direct DB status writes bypassing validation.

---

## Domain Entities

See `entities.json` for the canonical entity definitions. When adding new fields or relations, update `entities.json` first, then the TypeScript types in `backend/src/types/`.

---

## Claude API

### `/claude-api`
Use if any feature in this project integrates with the Anthropic SDK (e.g. AI document verification — currently deprioritised as Low priority). Trigger when any file imports `anthropic` or `@anthropic-ai/sdk`.
