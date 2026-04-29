## Table of Contents

- [Use case(s) or feature that is chosen to be built](#use-cases-or-feature-that-is-chosen-to-be-built)
- [Use case(s) or features to defer or mock](#use-cases-or-features-to-defer-or-mock)
  - [Mocked: Current User / Authentication & RBAC](#mocked-current-user--authentication--rbac)
  - [Deferred: AI-Powered Features](#deferred-ai-powered-features)
  - [Other features that are deferred](#other-features-that-are-deferred)
    - [UI Drag-and-Drop Functionality](#ui-drag-and-drop-functionality)
    - [Officer Support for Multiple Clarification Rounds](#officer-support-for-multiple-clarification-rounds)
    - [On-Site Draft Saving & Offline Sync](#on-site-draft-saving--offline-sync)
    - [Item-Level Comments per Checklist Section](#item-level-comments-per-checklist-section)
- [Ambiguity and Assumptions](#ambiguity-and-assumptions)
  - [No guidance on hosting, containerization, or CI/CD](#no-guidance-on-hosting-containerization-or-cicd)
  - [Unclear what triggers status transitions](#unclear-what-triggers-status-transitions)
- [Tech Stack and Architecture](#tech-stack-and-architecture)

---

## Use case(s) or feature that is chosen to be built

For this assessment, I have chosen to focus on the core licensing application and review workflow by selectively implementing key features from Use Case 1 (Operator) and Use Case 2 (Officer). The prioritized flow centers on an end-to-end process where an Operator submits a licensing application, an Officer reviews it and provides structured feedback, and both parties can track and respond to the application status.

Since Role-Based Access Control (RBAC) and user authentication are outside the scope of this project, the system is implemented as a simplified, generic interface. Both the application submission and officer review views are accessible without login, allowing the assessment to focus purely on the core mechanics of form completion, feedback generation, and status tracking.

The selected features captures the essential interactions of this workflow:

- [UC1] Operator fills in a complete application form
- [UC1] Operator submits application with clear guidance and specific feedback on incompleteness
- [UC1] Operator sees application status as 'Pending Pre-Site Resubmission'
- [UC1] Operator sees officer comments displayed prominently at the top of their application
- [UC2] Officer efficiently reviews applications and provides clear, actionable feedback
- [UC2] Officer accesses full application submission in an organised structure

## Use case(s) or features to defer or mock

### Mocked: Current User / Authentication & RBAC

Since role-based access control and user authentication are outside the scope of this assessment, the current user is mocked to simulate an active session. This grants temporary access to both operator and officer views, allowing the assessment to focus purely on the core licensing workflow rather than authentication infrastructure.

### Deferred: AI-Powered Features

AI-driven enhancements are explicitly deferred. While these features would undoubtedly improve workflow efficiency and reduce manual effort, they operate as an optimization layer rather than a core product requirement. The licensing system’s fundamental value—structured application submission, transparent officer review, and actionable feedback—relies entirely on deterministic business logic. The system functions completely without AI, and deferring it allows the project to prioritize stability, usability, and core data integrity within the assessment timeline.

### Other features that are deferred

#### UI Drag-and-Drop Functionality

Why deferred: While drag-and-drop can improve UX for document uploads or field reordering, it introduces significant front-end complexity and edge-case handling. A structured, linear form with standard file inputs sufficiently meets the core submission requirements and keeps the interface predictable and accessible.

#### Officer Support for Multiple Clarification Rounds

Why deferred: The assessment prioritizes a single, high-quality feedback loop. By implementing robust validation, clear submission guidelines, and prominently displayed officer comments, the need for iterative back-and-forth is minimized. Multi-round clarification workflows can be introduced later as a scalability enhancement once the core review process is stabilized.

#### On-Site Draft Saving & Offline Sync

Why deferred: Persistent draft saving for field officers requires additional state management, local storage handling, and conflict resolution logic. For this assessment, officers can complete reviews post-visit or use temporary external notes, with the final digital submission capturing all necessary data. This keeps the architecture focused on the primary online submission/review flow.

#### Item-Level Comments per Checklist Section

Why deferred: Attaching comments to individual checklist items adds granular auditability but significantly increases UI complexity and cognitive load. For the core workflow, consolidated comments at the application level provide sufficient context and actionable guidance for operators. This feature can be added later if regulatory compliance demands stricter, field-level traceability.

## Ambiguity and Assumptions

### No guidance on hosting, containerization, or CI/CD

- Local development only; provide `docker-compose.yml` for easy setup; skip cloud deployment scripts for submission

### Unclear what triggers status transitions

- Assume: manual status update by Officer via dropdown; no automated workflows or business rules engine. But for the feature that is developed for submission, we can only see one status

## Tech Stack and Architecture

This project implements a **TypeScript-first, full-stack architecture** designed for maintainability, type safety, and government-grade reliability.

- **Frontend:** Next.js (App Router) delivering a responsive, accessible interface aligned with public-sector design standards.
- **Backend:** Node.js with Express, handling robust business logic and API orchestration.
- **Data Layer:** PostgreSQL managed via Sequelize ORM, enabling type-safe queries, structured migrations, and clean entity modeling for core resources (e.g., `Applications`, `Comments`).
- **Security & Reliability:** Multi-layered validation using Zod, reinforced by defense-in-depth practices including magic-byte file verification and atomic database transactions to guarantee data integrity and prevent corruption.
- **System Architecture:** Organized around a clean, service-oriented pattern that enforces strict separation of concerns across API routing, domain services, and modular, reusable UI components.
