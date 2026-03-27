# Improvements

This document captures cleanup and stabilization work needed to move the project from prototype quality to a safer, more maintainable internal application.

## Priority 1: Security And Access Control

### 1. Enforce authorization on every server action

The current code relies too much on UI visibility and page-level redirects. That is not sufficient protection.

Actions that need explicit server-side role checks:

- `deleteUser` in [app/actions/users.ts](/home/oliver/Documents/ateneo-web/app/actions/users.ts)
- `createUser` in [app/actions/users.ts](/home/oliver/Documents/ateneo-web/app/actions/users.ts)
- `deleteSong` in [app/actions/songs.ts](/home/oliver/Documents/ateneo-web/app/actions/songs.ts)
- `createSong` in [app/actions/songs.ts](/home/oliver/Documents/ateneo-web/app/actions/songs.ts)
- `createEvent` in [app/actions/events.ts](/home/oliver/Documents/ateneo-web/app/actions/events.ts)
- `eventSignup` in [app/actions/events.ts](/home/oliver/Documents/ateneo-web/app/actions/events.ts)

Recommended cleanup:

- Add a shared helper such as `requireSession()` and `requireRole([...])`.
- Keep role definitions in one place instead of repeating string arrays inline.
- Return structured authorization errors instead of silent no-ops.

### 2. Lock down protected pages consistently

Most protected dashboard routes are checked, but not all pages are equally strict.

Known gap:

- [app/dashboard/users/create/page.tsx](/home/oliver/Documents/ateneo-web/app/dashboard/users/create/page.tsx) has no role check.

Recommended cleanup:

- Add page-level guards to every admin-only route.
- Treat page protection and action protection as separate requirements. Both are needed.

### 3. Clean up secret handling

Current session code assumes `JWT_SECRET` exists and uses it immediately.

Relevant file:

- [lib/session.ts](/home/oliver/Documents/ateneo-web/lib/session.ts)

Recommended cleanup:

- Validate `JWT_SECRET` during startup.
- Fail fast with a clear error if required environment variables are missing.
- Set `secure` cookies conditionally for production instead of forcing them in all environments.
- Consider adding `maxAge` and explicit session typing for consistency.

### 4. Treat the leaked secret artifact as compromised

The `prisma` directory contains a malformed file with a secret embedded in the filename. That should be treated as an accidental leak.

Recommended cleanup:

- Delete the malformed file from the repository.
- Rotate the JWT secret immediately.
- Confirm `.env` files and local database files are ignored correctly.
- Review shell history or scripts if this was caused by a command typo.

## Priority 2: Repository Hygiene

### 5. Stop tracking local runtime artifacts

The repository currently contains local database files under `prisma/`.

Recommended cleanup:

- Remove tracked SQLite database files from version control.
- Keep only schema, migrations, and optional seed scripts in the repo.
- Ensure `.gitignore` excludes development DB files, `.env`, and generated output.

### 6. Replace the default README

The current README is still the stock Next.js template and does not describe the project.

Relevant file:

- [README.md](/home/oliver/Documents/ateneo-web/README.md)

Recommended cleanup:

- Describe what the app is for.
- Document local setup, required environment variables, Prisma commands, seed flow, and login process.
- Document the role model and expected user permissions.
- Add deployment and backup notes if the app is intended for real use.

## Priority 3: Data Model Cleanup

### 7. Replace free-form strings with enums or validated values

Several database fields currently allow arbitrary strings where the domain is clearly finite.

Relevant file:

- [prisma/schema.prisma](/home/oliver/Documents/ateneo-web/prisma/schema.prisma)

Candidates:

- `User.voice`
- `Event.type`
- `EventSignup.status`
- `Song.sheetType`

Recommended cleanup:

- Use Prisma enums where possible.
- Mirror those enums in Zod validation.
- Reject invalid values before they reach the database.

### 8. Normalize loosely structured song data

`Song.fileLinks` is currently stored as a single string with a comment indicating it may contain serialized data.

Recommended cleanup:

- Decide whether this should be one URL, multiple URLs, or actual file metadata.
- If multiple links are needed, create a separate related table instead of storing ad hoc serialized text.
- Validate URL format in the form layer.

### 9. Review unused or incomplete models

The schema includes `Rehearsal`, but the app does not appear to use it.

Recommended cleanup:

- Either implement the model in the product or remove it until needed.
- Avoid carrying unused schema and migration surface area.

## Priority 4: Code Quality And Maintainability

### 10. Make lint pass and keep it passing

`npm run lint` currently fails.

Current issues include:

- `any` in server actions and page rendering
- unused imports
- unused caught errors
- weak typing of action state

Recommended cleanup:

- Define shared action result types.
- Replace `any` with concrete types from Prisma or local interfaces.
- Remove unused imports and variables.
- Add lint to CI before merging future changes.

### 11. Reduce repeated authorization and validation logic

The action files repeat the same patterns for session lookup, role checks, validation, revalidation, and redirects.

Relevant files:

- [app/actions/users.ts](/home/oliver/Documents/ateneo-web/app/actions/users.ts)
- [app/actions/events.ts](/home/oliver/Documents/ateneo-web/app/actions/events.ts)
- [app/actions/songs.ts](/home/oliver/Documents/ateneo-web/app/actions/songs.ts)
- [app/actions/profile.ts](/home/oliver/Documents/ateneo-web/app/actions/profile.ts)

Recommended cleanup:

- Extract shared validation and authorization helpers.
- Standardize action return shapes.
- Centralize role constants.
- Use typed form state instead of ad hoc objects.

### 12. Improve error handling

Most `catch` blocks return generic messages and discard useful detail.

Recommended cleanup:

- Handle known Prisma errors explicitly, especially unique constraint failures.
- Log unexpected errors in a consistent place.
- Return user-safe messages while preserving enough detail for debugging.

## Priority 5: UX And Product Completeness

### 13. Replace placeholder dashboard content with real workflows

The dashboard currently shows generic counts and non-functional quick-action buttons.

Relevant file:

- [app/dashboard/page.tsx](/home/oliver/Documents/ateneo-web/app/dashboard/page.tsx)

Recommended cleanup:

- Link quick actions to actual destinations.
- Show role-specific tasks with real data.
- Prefer useful summaries such as upcoming events, pending signups, inactive users, or recent changes.

### 14. Tighten event signup behavior

The signup buttons optimistically update local state without handling server failures or validating allowed status values.

Relevant file:

- [app/ui/events/buttons.tsx](/home/oliver/Documents/ateneo-web/app/ui/events/buttons.tsx)

Recommended cleanup:

- Use a typed status enum.
- Surface failure states to the user.
- Disable updates outside the signup window if the event has open/close limits.
- Consider showing current signup status more clearly.

### 15. Make the visual system more consistent

The app has a decent direction, but styling is still mixed between intentional pages and default scaffold remnants.

Relevant files:

- [app/login/page.tsx](/home/oliver/Documents/ateneo-web/app/login/page.tsx)
- [app/globals.css](/home/oliver/Documents/ateneo-web/app/globals.css)

Recommended cleanup:

- Remove scaffold-era defaults such as the Arial fallback taking over the app.
- Define a clearer shared color and spacing system.
- Make public pages and dashboard pages feel like the same product.
- Improve table responsiveness on smaller screens.

## Priority 6: Testing And Operational Readiness

### 16. Add basic automated tests

The project currently has no visible test coverage.

Recommended cleanup:

- Add tests for login and logout.
- Add tests for admin-only actions and pages.
- Add tests for signup status updates.
- Add tests for schema validation and password change flow.

### 17. Add environment and deployment checks

Recommended cleanup:

- Add a startup check for required env vars.
- Document production requirements for database, secrets, and cookie security.
- If the app will be hosted publicly, move off SQLite unless there is a clear operational reason not to.

## Suggested Order Of Work

1. Remove tracked secrets and local DB artifacts.
2. Rotate `JWT_SECRET` and harden env validation.
3. Add centralized authorization helpers and fix missing role checks.
4. Make lint pass.
5. Tighten the Prisma schema and Zod validation.
6. Replace README with real project documentation.
7. Improve dashboard and signup UX.
8. Add a basic automated test suite.
