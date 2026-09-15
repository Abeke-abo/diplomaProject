# RemoteP Diploma Checklist

This project is a full web application:

- React frontend
- Java Spring Boot backend
- JWT authorization
- role-based admin panel
- registration with name, password confirmation, and clear validation errors
- user profile page with personal contact requests
- contact request CRM
- PostgreSQL tables for services and portfolio projects
- request priorities, admin comments, status history, and Telegram logs
- H2 for local demo
- PostgreSQL profile for production-like setup
- optional Telegram notifications
- integration tests for auth, contacts, and admin access

## Demo Scenario

1. Start PostgreSQL or use default H2.
2. Start backend on `http://localhost:5000`.
3. Start frontend on `http://localhost:5173`.
4. Send a contact request from the main page.
5. Register a regular user and show `/profile`.
6. Create a request from the user profile and show it in "Мои заявки".
7. Try to open `/admin` as the regular user and show that access is denied.
8. Logout and login as admin:

```text
ADMIN_EMAIL from local environment
ADMIN_PASSWORD from local environment
```

9. Open `/admin`.
10. Show the linked user account, search, status filter, priority update, admin comment, Telegram status, and delete action.

## What To Explain In The Diploma

### Architecture

Frontend talks to backend through REST API.

Backend is split into layers:

- `Controller` receives HTTP requests.
- `Service` contains business logic.
- `Repository` works with the database.
- `Entity` describes database tables.

### Authentication

The user sends email and password to `/api/auth/login`.

Backend checks the BCrypt password hash and returns:

- access token
- refresh token
- user data

Frontend stores the tokens and sends:

```http
Authorization: Bearer token
```

### Roles

The backend has two roles:

```text
USER
ADMIN
```

Only admins can read, delete, and update contact requests.

Frontend also hides admin navigation for regular users, but the main protection is in backend:

```java
@PreAuthorize("hasRole('ADMIN')")
```

### Database Tables

Core tables:

- `users`
- `refresh_tokens`
- `contact_requests`
- `contact_request_comments`
- `contact_request_status_history`
- `telegram_notifications`
- `services`
- `portfolio_projects`

Logged-in requests are connected with `contact_requests.user_id`, so a regular user sees only their own requests in the profile.

### Contact Request Flow

1. User submits the form on the landing page or in the profile.
2. Frontend sends `POST /api/contacts`.
3. Backend validates name, email, and message.
4. If the user is authenticated, backend links the request to `users.id`.
5. Backend saves the request with `NEW` status.
6. Backend saves status history and Telegram notification log.
7. User sees the request in "Мои заявки".
8. Admin sees the request in the dashboard.
9. Admin changes status, priority, and adds a comment.

## Next Improvements

- Add pagination for contacts.
- Add email notifications.
- Add deployment instructions.
