# EduBridge Frontend

A modern, responsive web application for connecting students with helpers and managing help requests.

## Change Request Intake

**⚠️ IMPORTANT PROCESS CONSTRAINT**

Before implementing any UI changes or new features, a formal change request intake process must be completed:

1. **Review the Change Request Template**: See [frontend/docs/change-request-intake.md](./docs/change-request-intake.md)
2. **Complete the Itemized Change List**: For each requested change, document:
   - Affected route/page (e.g., Landing, Login, Student Dashboard)
   - Current behavior/content (what exists now)
   - Desired behavior/content (exact replacement copy for text, clear UI/behavioral expectations for functionality)
   - Verification steps (how to test the change)
3. **Obtain Confirmation**: The change list must be reviewed and explicitly confirmed before implementation begins
4. **No Implementation Without Confirmation**: Do not commit or implement UI changes until the itemized list is completed and user-confirmed

This process ensures clarity, prevents miscommunication, and guarantees that all changes meet expectations.

---

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS with OKLCH color system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Internet Computer (Motoko)
- **Authentication**: Internet Identity

## Project Structure

