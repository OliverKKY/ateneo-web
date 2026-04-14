# Ateneo Web Improvement Roadmap

This document tracks how the new `ateneo-web` app should grow into a familiar but improved replacement for the old `OliverKKY/choirify` application.

The goal is not to copy Choirify. The goal is to preserve the useful choir workflows while keeping the new app simpler, safer, and easier to maintain.

## Current Baseline

The replacement already has a stronger technical foundation than the old app:

- Next.js App Router instead of the old ASP.NET MVC controller/view stack.
- Prisma-backed data model with migrations.
- Zod validation at action boundaries.
- Centralized session and authorization helpers in `lib/`.
- Centralized roles, labels, and bounded values in `lib/definitions.ts`.
- Focused server actions for users, events, songs, auth, and profile changes.
- Public pages separated from the internal dashboard.
- Existing tests for helper-level behavior.

The current app already supports:

- login and signed session cookies
- role-aware dashboard
- user CRUD
- event CRUD
- event signup with `Jdu`, `Možná`, `Nejdu`
- song archive CRUD
- profile password change
- basic public home/about/events/gallery pages

## What Is Better Than Old Choirify

- The codebase is smaller and easier to reason about.
- Authorization is centralized instead of spread across many controllers.
- Form validation is explicit and close to database writes.
- The dashboard is clearer and role-aware.
- The event signup workflow is faster for ordinary singers.
- The schema avoids carrying every historical field before it is confirmed as needed.
- The app has modern quality gates: tests, lint, TypeScript, Prisma validation, and build checks.

## Main Gaps Against Old Choirify

Old Choirify had a richer choir domain model. The current app is a good intranet starter, but not yet a full replacement.

Missing or incomplete areas:

- rehearsals
- rehearsal attendance
- rehearsal-song planning
- detailed singer/member profiles
- choirmaster profiles
- news/announcements
- multiple links per event and song
- event descriptions, organizers, and images
- event detail pages
- registration comments and absence reasons
- dress order tracking
- attendance tracking separate from signup intent
- event-song relationships
- sheet ownership/order tracking per singer and song
- registration export for admins
- self-registration, invite, email confirmation, and password reset flows
- multi-role users
- soft delete/archive behavior
- stronger database constraints for bounded values

## Product Direction

Keep the new app focused. Restore old Choirify concepts only when they still matter to Ateneo users.

Prefer these principles:

- Improve the workflow instead of reproducing old screens.
- Keep members' daily flows simple.
- Keep admin workflows explicit and auditable.
- Treat personal data fields as deliberate product decisions.
- Add database structure before building complicated UI on top of weak data.
- Preserve server-side authorization for every privileged route and action.

## Implementation Checklist

Work through this list one feature area at a time. Each item should include schema changes, server actions, UI, authorization, tests, and seed/migration updates where relevant.

### 0. Preserve The Current Foundation

- [x] Keep `Next.js`, `Prisma`, `Zod`, and server actions as the core architecture.
- [x] Keep shared roles and bounded values in `lib/definitions.ts`.
- [x] Keep auth/session checks centralized in `lib/auth.ts` and `lib/session.ts`.
- [x] Keep page guards and action guards separate.
- [x] Keep `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` passing.
- [ ] Add a short product README section explaining which old Choirify features are intentionally not implemented yet.
- [ ] Add smoke coverage for protected dashboard routes, not only helper functions.

### 1. Harden Existing Core Models

- [ ] Convert bounded string fields to Prisma enums or equivalent database constraints:
  - [ ] `User.voice`
  - [ ] `Event.type`
  - [ ] `EventSignup.status`
  - [ ] `Song.sheetType`
- [ ] Align Prisma enum values with `lib/definitions.ts`.
- [ ] Add a safe migration for existing data.
- [ ] Add tests proving invalid bounded values are rejected before database writes.
- [ ] Decide whether hard deletes should remain acceptable for users, events, and songs.
- [ ] If not, add soft delete/archive fields and update queries to hide archived records by default.

### 2. Improve Event Details

Old Choirify events had more context than the current model.

- [ ] Add event fields:
  - [ ] `description`
  - [ ] `organizer`
  - [ ] `imageUrl`
  - [ ] visibility/published state if public event display should be controlled
- [ ] Update event create/edit forms.
- [ ] Update public events page to show richer event details without exposing internal signup data.
- [ ] Add internal event detail route.
- [ ] Add validation for description length, organizer length, image URL, and date ranges.
- [ ] Add tests for create/update validation and authorization.

### 3. Add Event Registration Details

Old Choirify registration included an answer, comment, dress order, and registration timestamp. The current signup status is simpler but loses useful admin information.

- [ ] Extend `EventSignup` with:
  - [ ] `comment`
  - [ ] `dressOrder`
  - [ ] `updatedAt`
- [ ] Decide whether `maybe` stays or maps to a more old-style yes/no answer.
- [ ] Require an absence reason when a singer chooses `Nejdu`, if Ateneo wants the old behavior.
- [ ] Add dress order options only for relevant voice groups, if still needed.
- [ ] Update signup UI to allow optional comment and dress selection.
- [ ] Keep the quick one-click signup path simple for common cases.
- [ ] Add tests for signup window rules, comment validation, and updating an existing signup.

### 4. Add Event Signup Admin View

Admins need the operational view old Choirify provided.

- [ ] Add per-event admin detail page.
- [ ] Show signup counts by status.
- [ ] Show singers who answered `Jdu`, `Možná`, `Nejdu`.
- [ ] Show members with no answer.
- [ ] Filter by voice group and status.
- [ ] Show comments and dress orders.
- [ ] Add CSV export first.
- [ ] Add XLSX export later if CSV is not enough.
- [ ] Add authorization tests for event managers vs singers.

### 5. Add Attendance Tracking

Signup intent and actual attendance should be separate concepts.

- [ ] Add `EventAttendance` model.
- [ ] Link attendance to event and user/member.
- [ ] Add admin UI to mark actual attendance.
- [ ] Keep attendance hidden from ordinary members unless there is a clear need.
- [ ] Add summary counts on event admin detail.
- [ ] Add tests for attendance creation/update permissions.

### 6. Expand Member Profiles Carefully

Old Choirify had detailed `Singer` and `Choirmaster` entities. The current app merges account and member fields into `User`.

- [ ] Decide whether to keep one `User` model or split `MemberProfile` from login credentials.
- [ ] Add confirmed member fields only if needed:
  - [ ] birth date
  - [ ] detailed voice group: `S1`, `S2`, `A1`, `A2`, `T1`, `T2`, `B1`, `B2`
  - [ ] phone
  - [ ] address
  - [ ] profile image URL
  - [ ] GDPR consent timestamp
- [ ] Decide whether ID card and passport numbers are still necessary.
- [ ] If ID/passport fields are added, document why they are needed and restrict access tightly.
- [ ] Update user admin forms and profile page.
- [ ] Let members update safe personal fields themselves if desired.
- [ ] Add tests for self-update permissions and admin-only sensitive fields.

### 7. Add Rehearsals

Rehearsals were a first-class feature in Choirify.

- [ ] Add `Rehearsal` model:
  - [ ] date/time
  - [ ] location
  - [ ] description
  - [ ] optional published state
- [ ] Add rehearsal list page for members.
- [ ] Add rehearsal create/edit/delete for authorized roles.
- [ ] Add dashboard card for upcoming rehearsals.
- [ ] Add tests for rehearsal CRUD authorization.

### 8. Add Rehearsal Attendance

- [ ] Add `RehearsalAttendance` model.
- [ ] Add admin UI to mark rehearsal attendance.
- [ ] Add optional member self-indication only if the choir needs it.
- [ ] Add attendance summaries.
- [ ] Add tests around attendance permissions.

### 9. Relate Songs To Events And Rehearsals

Old Choirify could connect songs to events and rehearsals. That is important for planning.

- [ ] Add `EventSong` join model.
- [ ] Add `RehearsalSong` join model.
- [ ] Add UI to attach songs to an event.
- [ ] Add UI to attach songs to a rehearsal.
- [ ] Show planned songs on event/rehearsal detail pages.
- [ ] Show upcoming uses on song detail pages.
- [ ] Add tests for attach/remove permissions.

### 10. Improve Song Archive And Sheet Tracking

The current song archive is useful, but old Choirify also tracked sheet ownership/order status per singer.

- [ ] Decide whether `Song.isActive` is enough or whether `current/archive` should be explicit in the UI.
- [ ] Add multiple song links instead of a single `fileLinks` string.
- [ ] Add `SongLink` or general `Link` model.
- [ ] Add `SingerSongSheetStatus` model with statuses similar to:
  - [ ] no copy
  - [ ] ordered
  - [ ] has copy
- [ ] Add singer-facing controls for requesting/confirming sheets if still needed.
- [ ] Add admin controls for distributing/ordering sheets for many singers.
- [ ] Add sheet status overview per song.
- [ ] Add tests for sheet status transitions and permissions.

### 11. Add Shared Links

Old Choirify allowed multiple links on events and songs.

- [ ] Add a generic `Link` model or separate `EventLink` and `SongLink` models.
- [ ] Store URL, label/description, ordering, created/updated timestamps.
- [ ] Add create/remove link actions.
- [ ] Add URL validation.
- [ ] Show links on public event details only when intended for public viewing.
- [ ] Add tests for link authorization and validation.

### 12. Add News Or Announcements

Old Choirify had `News`. Decide whether this is still useful or whether public CMS/social channels cover it.

- [ ] Decide public news, internal announcements, or both.
- [ ] Add `Announcement` model if needed:
  - [ ] title
  - [ ] body
  - [ ] image URL
  - [ ] author
  - [ ] published state
  - [ ] created/updated timestamps
- [ ] Add dashboard announcement list.
- [ ] Add public news page only if the choir wants website news.
- [ ] Add admin/editor permissions.
- [ ] Add tests for publish/edit permissions.

### 13. Improve Account Lifecycle

The current app assumes admin-created users. Old Choirify had registration, email confirmation, forgot password, and reset password.

- [ ] Decide onboarding model:
  - [ ] admin-created accounts only
  - [ ] invite links
  - [ ] public self-registration with approval
- [ ] Add password reset flow.
- [ ] Add email sending configuration.
- [ ] Add email verification only if email ownership matters for login or notifications.
- [ ] Add account lockout or rate limiting for repeated failed logins.
- [ ] Add tests for token expiry and invalid token handling.

### 14. Revisit Roles And Permissions

Old Choirify had many roles: admin, singer, choirmaster, voice leader, dresscode leader, chairman, vice chairman, music distributor, manager.

- [ ] Decide whether one role per user is enough.
- [ ] If users need several responsibilities, add many-to-many user roles.
- [ ] Map old roles to current Czech role names.
- [ ] Define permission groups in `lib/definitions.ts`, not inline in pages.
- [ ] Add route/action tests for each permission group.
- [ ] Update seed data with representative users for each role.

### 15. Improve Dashboard Familiarity

The dashboard should feel familiar to Choirify users without copying the old UI.

- [ ] Add dashboard sections for:
  - [ ] upcoming events
  - [ ] upcoming rehearsals
  - [ ] my event answers
  - [ ] songs I need sheets for
  - [ ] admin alerts: missing registrations, upcoming signup deadlines
- [ ] Keep role-specific quick actions.
- [ ] Add empty states that tell users what to do next.
- [ ] Add tests for dashboard data helpers where practical.

### 16. Data Migration From Old Choirify

Only needed if real old data will be imported.

- [ ] Export old Choirify data to a neutral format.
- [ ] Map old `Singer`/`Choirmaster`/`ApplicationUser` records to the new user/profile model.
- [ ] Map old event types to new event types.
- [ ] Map old sheet types to new sheet types.
- [ ] Map old registrations and comments to `EventSignup`.
- [ ] Map old sheet statuses to the new sheet tracking model.
- [ ] Write an idempotent import script.
- [ ] Run import against a disposable database first.
- [ ] Add post-import checks for counts and orphaned records.

## Technical Quality Checklist

Apply these checks to every feature above:

- [ ] Authorization is enforced server-side in actions and page loaders.
- [ ] Validation happens before database writes.
- [ ] Bounded values are defined once in `lib/definitions.ts`.
- [ ] Prisma schema, Zod schemas, labels, and UI options agree.
- [ ] Migrations preserve existing data.
- [ ] Seed data is updated when new required models are added.
- [ ] Tests cover success, validation failure, and authorization failure.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes when the change affects runtime/build behavior.

## Recommended Implementation Order

1. Harden existing bounded fields and delete/archive behavior.
2. Add richer event details.
3. Add richer event signup data.
4. Add event signup admin view and export.
5. Expand member profiles.
6. Add rehearsals.
7. Add rehearsal attendance.
8. Add event-song and rehearsal-song planning.
9. Add sheet tracking.
10. Add links for events and songs.
11. Add announcements if still useful.
12. Add account lifecycle improvements.
13. Revisit multi-role permissions only when a real user needs multiple responsibilities.

## Notes From Old Choirify Comparison

The old repository inspected was `OliverKKY/choirify` at commit `ce76370`.

Useful old concepts to preserve:

- event registration deadlines
- per-event registration overview
- registration comments
- dress orders
- rehearsal management
- song planning for events/rehearsals
- sheet copy tracking
- admin exports
- role-specific navigation

Concepts to reconsider before copying:

- storing ID card and passport numbers
- public self-registration
- separate singer and choirmaster entities
- many small role-specific pages
- hard dependency on a specific old UI layout

The replacement should stay simpler than Choirify unless a specific workflow proves the extra complexity is worth it.
