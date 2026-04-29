## #2 Operator fills in a complete application form

```
Let the planner agent come out with a plan on the implementation of this ticket first.
Before execution, i will have to review and approve them first.
Ask me any questions when in doubt on the requirements and feature, do not assume anything.

## Scope
Work on the implementation of backend and frontend of the application.
As long as you follow the folder structure respectively on frontend and backend

## Read First
- CLAUDE.md of each folder to assign tasks to different agents

## Task
Implement a POST endpoint for operators to create a submission
oon the application form. The application form should contains information
such as Name, NRIC/Passport Number, email, Home Address, Business Address,
Licence Type, Supporting Documents in PDF, relevant declarations. Add any relevant
fields that i might have missed.

Page should be professional, simple and modern.

This should be the table that is created
column name
type
constraints
default value (optional)
notes (optional)

applications table
id
UUID
PRIMARY KEY, NOT NULL
gen_random_uuid()
-
full_name
STRING(100)
NOT NULL
-
nric_or_passport
STRING(20)
NOT NULL
-
date_of_birth
DATEONLY
NOT NULL
-
gender
STRING(20)
NOT NULL
-
CHECK: IN (GENDERS)
nationality
STRING(60)
NOT NULL
-
contact_number
STRING(20)
NOT NULL
-
email
STRING(255)
NOT NULL
-
Indexed
home_address
TEXT
NOT NULL
-
business_name
STRING(200)
NOT NULL
-
business_address
TEXT
NOT NULL
-
years_in_operation
SMALLINT
NOT NULL
-
CHECK: BETWEEN 0 AND 100
licence_type
STRING(50)
NOT NULL
-
CHECK: IN (LICENCE_TYPES)
declaration_accuracy
BOOLEAN
NOT NULL
-
CHECK: = TRUE
declaration_consent
BOOLEAN
NOT NULL
-
CHECK: = TRUE
status
STRING(30)
NOT NULL
'submitted'
CHECK: IN (APPLICATION_STATUSES), Indexed
-
created_at
DATE
NOT NULL
NOW()
Indexed
-
updated_at
DATE
NOT NULL
NOW()

application_documents
id
UUID
PRIMARY KEY, NOT NULL
gen_random_uuid()
-
application_id
UUID
NOT NULL, FK → applications.id
–
CASCADE on DELETE/UPDATE, Indexed
-
original_name
STRING(255)
NOT NULL
–
Original uploaded filename
-
stored_path
STRING(500)
NOT NULL
–
File path/URL in storage
-
mime_type
STRING(100)
NOT NULL
–
CHECK: = 'application/pdf'
size_bytes
INTEGER
NOT NULL
–
CHECK: > 0 AND <= 10485760 (10MB)
-
created_at
DATE
NOT NULL
NOW()
updated_at
-
DATE
NOT NULL
NOW()


## Output
frontend: should add a new route called `/application`
backend: should create a new POST endpoint that sends in the application and
create a migration file to create a new table applications to store the
data in postgreSQL database.
backend validation: validation on the request body should be done using zod library.
frontend and backend: include simple and functional unit testing. Keep tests focused on core functionality, not exhaustive edge coverage

## Rules
- TypeScript strict, no any
- Fail closed — deny if role is missing or unrecognise

## Edge Cases
- Network timeout or API failure during submission
- Rapid double-click/accidental duplicate submissions
- Special characters, extremely long inputs, and XSS-safe sanitization
- Date/time/timezone formatting mismatches
- Validation triggers: on blur, on submit, and on field change
- Partial data persistence (drafts vs final submission)
- Backend schema changes requiring frontend Zod schema alignment
```

## #1 Operator submits application with clear guidance and specific feedback on incompleteness

```
Let the planner agent come out with a plan on the implementation of this ticket first.
Before execution, i will have to review and approve them first.
Ask me any questions when in doubt on the requirements and feature, do not assume anything.

## Scope
Work on the implementation of backend and frontend of the application.
As long as you follow the folder structure respectively on frontend and backend

## Read First
- CLAUDE.md of each folder to assign tasks to different agents

## Task
complete this user story
As an Operator, I want to submit my application with clear guidance and receive specific feedback when information is incomplete,
so that I can quickly address issues and resubmit without confusion or repeated rejections.

- Clear Instructions: Every form field/section must have explicit, visible guidance. No hidden rules or implicit requirements. All constraints must be stated directly on the UI.
- Intuitive UX: Linear, predictable flow. Validation errors must be specific, actionable, and field-targeted.
- Zod Validation: Frontend validation must use Zod. Schemas should be reusable, type-safe, and aligned with backend expectations.

## Output
frontend: should have a clear instructions on how to fill up the application form
frontend: zod validation on the form
include simple and functional unit testing. Keep tests focused on core functionality, not exhaustive edge coverage

## Rules
- TypeScript strict, no any

## Edge Cases
- Define when validation runs (on blur, on change, on submit) and ensure it doesn’t block legitimate user flow.
- Handling whitespace, empty vs null vs undefined, extremely long strings, special characters, and date/time format mismatches
- Loading/disabled state during API call to prevent duplicate submissions
- Graceful handling of timeouts, `4xx` validation mismatches, and `5xx` server errors with user-friendly feedback

```

## #6 Operator sees application status as 'Pending Pre-Site Resubmission’

```
Let the planner agent come out with a plan on the implementation of this ticket first.
Before execution, i will have to review and approve them first.
Ask me any questions when in doubt on the requirements and feature, do not assume anything.

## Scope
Work on the implementation of frontend and backend of the application.
As long as you follow the folder structure respectively on frontend and backend

## Read First
- CLAUDE.md of each folder to assign tasks to the respective specialised with the relevant skills agents

## Task
complete this user story
As an Operator, I want to see my application status as "Pending Pre-Site Resubmission" so that I clearly know action is required from me.

- After submission of the application, there should be a page to view the application that i have submitted
- frontend: create a page routing to `/all-applications` to display all the applications available from the database
- frontend: another page `/application/:application-id` this is open up the specific application, to view all the application details and data available from the database
- Clear Status Display in the application details page: Show the status "Pending Pre-Site Resubmission" prominently in the application detail view with a distinct visual style (e.g., warning-colored badge).- Display accepted file type (PDF only), max size, and max file count directly in the drop zone. No hidden requirements.
- When this status is active, display helper text explaining:
	- What "Pending Pre-Site Resubmission" means
	- It means Operator will have to wait for approval before the site visit can happen
- Enum Alignment:
backend: i have updated the APPLICATION_STATUSES values in 20260428000002-create-applications migration file. update accordingly across the files
frontend: Update Zod schema enum to include the new value; ensure type safety across API layer
- After application is submitted, the first status should be "Pending Pre-Site Resubmission".
- Format the status properly in the frontend. backend it is saved into the database in snake_case,
but displaying in the frontend UI should be properly formatted

## Output
frontend: should be able to display the status of the application so that user will know the status
enum values of the application status are updated accordingly, referring to the APPLICATION_STATUS const found in backend 20260428000002-create-applications
frontend: new route to `/all-applications` to list out all the applications available from the database
frontend: new route to `/application/:application-id` to displays the application details from the database

## Rules
- TypeScript strict, no any

## Edge Cases
-
```

## #7 Operator sees officer comments displayed prominently at the top of their application

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

## #13 Officer efficiently reviews applications and provides clear, actionable feedback

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
I want to be able to write and create new comment into the current application that i am opening, so that the applicant can see my comment

- **Payload**: `{ userId: string, applicationId: string, comment: string }`
  - `userId`: Hardcoded to a default value for now
  - `comment`: Max 250 characters, required, plain text
- **Backend Behavior**:
  - Validate payload strictly (max length 250, valid UUID format)
  - Insert into `comments` table mapping `userId` → `officer_id`
  - Return created comment with timestamps
  - No automatic application status change
- **Frontend Behavior**:
  - Display form prominently above application details
  - Character counter & live validation (max 250)
  - Disable submit button & show loading state during request
  - Show success/error toast on completion
  - Optimistically or synchronously refresh comment list
- **Display Requirements**:
  - Chronological order (newest first)
  - Each comment shows: Officer name & role badge, localized timestamp, preserved whitespace text
  - Empty state placeholder if none exist
  - Distinct visual styling from main form


## Rules
- TypeScript strict, no any

## Edge Cases
- Long Comments: Truncation with "Read more" toggle vs. full display; ensure layout doesn't break
- Multiple Comments: Sorting logic, scroll behavior if list grows long. Right now, display all comments present
```
