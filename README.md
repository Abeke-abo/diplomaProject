# RemoteP

RemoteP is a diploma fullstack web application for an IT outsourcing agency. The project includes a public website, user registration and login, personal cabinet, admin panel, PostgreSQL database, Telegram notifications, and documented REST API.

## Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, i18next, lucide-react, Framer Motion
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT, Springdoc OpenAPI
- Database: PostgreSQL for the main profile, H2 for tests
- Tools: Maven, pgAdmin, Postman collection, Swagger UI

## Architecture

The frontend is a React single-page application. It sends requests to the backend through Axios and stores JWT tokens locally for authenticated routes.

The backend follows a layered architecture:

- Controller: receives HTTP requests and returns JSON
- Service: contains business logic and validation
- Repository: works with PostgreSQL through Spring Data JPA
- Entity: describes database tables
- DTO: separates API data from database entities

## Local Run

Backend:

```cmd
cd /d C:\Users\Asus\outsource-frontend\backend
C:\Users\Asus\.jdks\openjdk-23.0.2\bin\java.exe -jar target\backend-0.0.1-SNAPSHOT.jar
```

Frontend:

```cmd
cd /d C:\Users\Asus\outsource-frontend
npm run dev
```

Open:

```txt
Frontend: http://localhost:5173
Backend health: http://localhost:5000/api/health
Swagger UI: http://localhost:5000/swagger-ui.html
OpenAPI JSON: http://localhost:5000/api/docs
```

Local secrets are stored in `backend/application-local.properties`. This file is ignored by Git and must not be uploaded to GitHub.

## Diploma Demo Flow

1. Open the public site.
2. Register a new user.
3. Show the user profile with name, email, role, logout button.
4. Create a request from the personal cabinet.
5. Login as admin.
6. Show that a regular user cannot open `/admin`.
7. Open the admin panel.
8. Change request status and priority.
9. Add an admin comment.
10. Show the updated request in the user's cabinet.
11. Open Swagger UI and show documented API endpoints.
12. Open pgAdmin and show tables: `users`, `contact_requests`, `refresh_tokens`, `services`, `portfolio_projects`, `telegram_notifications`.

## Verification

Backend tests:

```cmd
cd /d C:\Users\Asus\outsource-frontend\backend
..\tools\apache-maven-3.9.11\bin\mvn.cmd test
```

Frontend build:

```cmd
cd /d C:\Users\Asus\outsource-frontend
npm run build
```

More defense notes are in `docs/FINAL_DEFENSE_GUIDE.md`.
