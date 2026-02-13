# Specification

## Summary
**Goal:** Add a new “Client” role and upgrade entry selection, request submission, and admin accept/reject messaging while preserving the existing EduBridge look-and-feel.

**Planned changes:**
- Add backend + frontend support for a new user role: Client (distinct from Student, Business, and existing Helper/Freelancer).
- Update the landing page ("/") to include an entry selection section with exactly three prominent options: Student, Client, Business, using transition/animated typography consistent with the current style.
- Update the Create Account flow to include Client and ensure all role labels are in English and consistent.
- Upgrade the authenticated work request form ("/work-request") for Student/Client/Business to collect and persist: Name, Age, Title, Description with role-specific helper text/examples.
- Add Online/Offline submission mode to the request form; when Offline is selected, display the exact meeting notice text and store the submission as offline with that location.
- Ensure the owner/admin inbox and request detail views display the new request fields (Name, Age, submission mode/location) and that existing accept/reject + chat initiation still work.
- Add automatic in-app acceptance/rejection notifications for submitters (English copy), generated at the moment an owner/admin accepts or rejects a request.
- Add a repository documentation/spec file describing roles, entry-selection flow, all request form fields, Online/Offline behavior (including the exact Moon Bake notice), and accept/reject notification behavior (including exact message copy).

**User-visible outcome:** Visitors can choose Student/Client/Business on the landing page, create accounts with the correct role, and (as Student/Client/Business) submit richer online/offline work requests; the owner/admin can review them with the added details, accept/reject them, and users receive automatic in-app confirmation/rejection messages tied to their request.
