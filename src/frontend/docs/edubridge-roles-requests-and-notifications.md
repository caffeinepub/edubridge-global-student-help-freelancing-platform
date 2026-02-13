# EduBridge: Roles, Requests, and Notifications

## User Roles

EduBridge supports five distinct user roles:

### 1. Student
- Can submit work requests for assignments, homework, and projects
- Has access to student dashboard to track request status
- Can chat with admin/owner about their requests

### 2. Client
- Can submit work requests for freelancing tasks
- Routes to work request page after login (no dedicated dashboard)
- Can chat with admin/owner about their requests

### 3. Business
- Can submit work requests for business services/products
- Has access to helper dashboard (shared with freelancers)
- Can chat with admin/owner about their requests

### 4. Helper/Freelancer
- Cannot submit work requests
- Can view available requests and assigned tasks
- Has access to helper dashboard

### 5. Admin/Owner
- Single owner account (enforced at backend)
- Full access to Owner Console
- Can approve or reject all pending requests
- Can chat with all request owners

## Landing Page Entry Selection

The landing page features three prominent role selection cards:

1. **Student** - "Get help with assignments, homework, and projects"
2. **Client** - "Request freelancing services for your projects"
3. **Business** - "Find expert help for business planning and execution"

Each card:
- Uses distinctive gradient styling matching the app theme
- Features animated hover effects (scale, glow)
- Routes to Create Account with the selected role pre-filled
- Uses session storage to persist role selection across navigation

## Create Account Flow

### Role Selection
The Create Account page includes a role picker with four options:
- Student
- Client
- Business
- Freelancer

If a user arrives from the landing page entry selection, their chosen role is automatically pre-selected.

### Required Fields
All users must provide:
- Name
- Age
- Email
- Country
- Role selection

## Work Request Form

### Access Control
Only the following roles can submit work requests:
- Student
- Client
- Business

Helpers/Freelancers and Admins cannot submit requests via this form.

### Form Fields

#### Basic Information
1. **Name** (required) - User's full name
2. **Age** (required) - User's age
3. **Title** (required) - Role-specific helper text:
   - Student: "Title of work (e.g., assignment, homework)"
   - Client: "Title of work requested (e.g., freelancing task)"
   - Business: "Title of service/product"
4. **Description** (required) - Detailed information about the request

#### Submission Mode
Users must select one of two modes:

**Online**
- Remote/virtual assistance
- No location information required

**Offline (In-person)**
- Face-to-face meeting required
- Displays fixed meeting location notice:
  > "Meeting Location: Moon Bake, Kengeri Satellite Town, Bangalore 560060"
- Additional fields required:
  - City (user's city)
  - Address (user's full address)

### Backend Storage
When a request is submitted:
- All form data is stored in the backend
- Submission mode is stored as enum: `#online` or `#offline`
- For offline requests, `submissionLocation` is automatically set to:
  `"Moon Bake, Kengeri Satellite Town, Bangalore 560060"`
- User-provided city and address are stored in `locationInfo`

## Owner/Admin Review

### Owner Inbox
The Owner Inbox displays all requests with:
- Request title and description
- Status badge (Pending, Accepted, Rejected, Completed)
- Submission mode indicator (Online/Offline with icons)
- For offline requests: displays the meeting location
- User location (city) if provided
- Created date
- Requester principal ID

### Owner Request Detail
The detail view shows:
- Full request information
- Submission mode (Online/Offline)
- Meeting location for offline requests (highlighted)
- User location details
- Moderation actions (Accept/Reject) for pending requests
- Embedded chat panel

### Moderation Actions
For pending requests, the owner can:

**Accept Request**
- Changes status to `accepted`
- Automatically sends acceptance notification message to the request owner
- Message content: "Your request has been accepted! We will get back to you soon."

**Reject Request**
- Changes status to `rejected`
- Automatically sends rejection notification message to the request owner
- Message content: "Unfortunately, your request has been rejected. Please feel free to submit another request with more details or try again later."

## User Notifications

### Automatic Notifications
When an admin accepts or rejects a request, the system automatically:
1. Creates a chat message associated with that request
2. Sets the sender as the admin
3. Marks the message as unread for the request owner
4. The message appears in the chat panel for that request

### Student Dashboard Notifications
The student dashboard displays:
- Status badges for all requests
- For accepted requests: Green success banner with acceptance message
- For rejected requests: Red warning banner with rejection message
- Unread message count badges on chat buttons
- Real-time updates via React Query polling

### Message Content

**Acceptance Message:**
