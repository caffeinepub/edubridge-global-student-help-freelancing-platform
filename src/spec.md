# Specification

## Summary
**Goal:** Separate the regular User experience from the single Owner/Admin console, allow authenticated users to submit work requests, and notify the Owner via Telegram and an in-site Owner inbox + chat.

**Planned changes:**
- Add clearly separated routes/entry points for Users (e.g., `/work-request`) vs Owner/Admin (e.g., `/owner`), including an Access Denied experience for non-admins attempting owner routes.
- Update request-submission permissions so any authenticated non-admin user (helper/student/business) can submit work requests; align frontend gating/toasts and backend authorization with the new rule.
- Implement an Owner Inbox in the Owner/Admin area that lists all work requests, includes a per-request details view, and provides access to the embedded website chat thread for that request.
- Extend chat authorization so the Admin/Owner can read/send/mark-read on any request thread, while non-admin users remain limited to permitted threads (request owner / assigned helper).
- Add Telegram notifications for every newly submitted work request to the provided channel, with secure configuration for bot credentials and an admin-only UI indicator for configured/working vs not configured/failing.
- Redesign the Admin dashboard information architecture and copy into an Owner-focused console (Inbox, Requests, Users, Analytics) while keeping Admin-only protections intact.
- Enforce single-owner behavior in the backend: prevent creation/assignment of additional Admin users and restrict owner-only operations to the established owner principal.

**User-visible outcome:** Users can submit work requests from a dedicated user route without the old permission block; the Owner can access an Owner-only console with an inbox and per-request chat, and receives Telegram alerts for new requests (with clear admin-only status if Telegram is not configured or fails).
