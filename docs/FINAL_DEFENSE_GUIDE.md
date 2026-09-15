# RemoteP Final Defense Guide

## What The Project Shows

RemoteP is a fullstack web application for receiving and processing client requests for an IT outsourcing company.

The system demonstrates:

- public landing page with services, portfolio, FAQ, and request form
- user registration and login
- JWT authorization and refresh tokens
- role-based access control: `USER` and `ADMIN`
- personal cabinet for users
- admin panel for request processing
- PostgreSQL database with related tables
- Telegram notification logging
- Swagger/OpenAPI documentation
- integration tests for core API scenarios

## Demo Accounts

For the local computer, the current admin credentials are stored in `backend/application-local.properties`.

Do not put real passwords or bot tokens into GitHub. For a clean repository, use `.env.example` and environment variables.

## Launch Checklist

1. PostgreSQL is running.
2. Database `remotep` exists.
3. Backend starts on `http://localhost:5000`.
4. Frontend starts on `http://localhost:5173`.
5. Health endpoint returns `UP`: `http://localhost:5000/api/health`.
6. Swagger opens: `http://localhost:5000/swagger-ui.html`.
7. Admin login works.
8. User registration works.
9. Request creation works.
10. Admin can change request status and add a comment.

## Protection Points To Explain

- Passwords are stored as BCrypt hashes.
- Access tokens are JWT tokens.
- Refresh tokens are stored in the database as hashes.
- Public registration always creates a `USER`.
- Admin panel is protected both on frontend and backend.
- Backend checks `hasRole('ADMIN')` before returning all requests.
- Local secrets are not committed to Git.

## API Endpoints To Show

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Login and receive tokens |
| `GET` | `/api/auth/me` | Current user profile |
| `POST` | `/api/contacts` | Create request |
| `GET` | `/api/contacts/my` | User's own requests |
| `GET` | `/api/contacts` | Admin request list |
| `PATCH` | `/api/contacts/{id}` | Admin status, priority, comment |
| `GET` | `/api/content/services` | Services from database |
| `GET` | `/api/content/portfolio` | Portfolio from database |
| `GET` | `/api/health` | Backend status |

## Database Tables

Main tables:

- `users`
- `refresh_tokens`
- `contact_requests`
- `contact_request_comments`
- `contact_request_status_history`
- `telegram_notifications`
- `services`
- `portfolio_projects`

## Final Defense Script

Say it simply:

> I developed a fullstack web application for an IT outsourcing company. The frontend is built with React and the backend is built with Java Spring Boot. Users can register, login, create requests, and track their statuses in the personal cabinet. Administrators have a protected panel where they can see all requests, change status and priority, add comments, and monitor Telegram delivery. Data is stored in PostgreSQL, authorization is implemented with JWT, and the API is documented through Swagger.

## Useful Links

```txt
Frontend: http://localhost:5173
Backend: http://localhost:5000/api
Health: http://localhost:5000/api/health
Swagger: http://localhost:5000/swagger-ui.html
OpenAPI JSON: http://localhost:5000/api/docs
```
