# RemoteP Backend

Spring Boot backend for the diploma project. It gives the React frontend a real API:

- registration and login
- user profile data through `/api/auth/me`
- JWT access tokens
- refresh tokens stored as hashes
- roles: `ADMIN` and `USER`
- public contact form
- user contact requests in the profile page
- admin-only contact dashboard
- service and portfolio content stored in the database
- admin comments, status history, priorities, and Telegram delivery logs
- H2 database for local demo, PostgreSQL profile for a diploma-ready setup

## How The Layers Work

`Controller` receives HTTP requests and returns JSON.

`Service` contains business logic: validation, passwords, tokens, status updates.

`Repository` talks to the database through Spring Data JPA.

`Entity` is a database table represented as a Java class.

## Main Endpoints

| Method | URL | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | public | Register user |
| `POST` | `/api/auth/login` | public | Login and get tokens |
| `POST` | `/api/auth/refresh` | public | Rotate refresh token |
| `POST` | `/api/auth/logout` | public | Revoke refresh token |
| `GET` | `/api/auth/me` | authenticated | Current user |
| `POST` | `/api/contacts` | public | Create contact request |
| `GET` | `/api/contacts/my` | authenticated | Current user's contact requests |
| `GET` | `/api/contacts` | admin | List contact requests |
| `GET` | `/api/contacts/{id}` | admin | View one contact request |
| `PATCH` | `/api/contacts/{id}` | admin | Update status, priority, or add admin comment |
| `PATCH` | `/api/contacts/{id}/status` | admin | Update status |
| `DELETE` | `/api/contacts/{id}` | admin | Delete contact request |
| `GET` | `/api/content/services` | public | Active services from PostgreSQL |
| `GET` | `/api/content/portfolio` | public | Active portfolio projects from PostgreSQL |
| `GET` | `/api/health` | public | Health check |
| `GET` | `/api/docs` | public | OpenAPI JSON |
| `GET` | `/swagger-ui.html` | public | Swagger UI |

## Contact Statuses

The admin dashboard uses three statuses:

```text
NEW
IN_PROGRESS
CLOSED
```

Status changes are saved through:

```http
PATCH /api/contacts/{id}/status
```

Request body:

```json
{
  "status": "IN_PROGRESS"
}
```

The expanded admin endpoint can also save priority and a CRM comment:

```http
PATCH /api/contacts/{id}
```

```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "comment": "Client was contacted"
}
```

## Demo Admin

The app creates an admin account on first start:

```text
email: value from ADMIN_EMAIL
password: value from ADMIN_PASSWORD
```

For local work, use `run-postgres.local.cmd`. Do not commit local credentials to GitHub.

Public registration always creates a regular `USER`. Admin access is created only by the seed admin settings or by changing a user role directly in the database.

## Run

Install Maven, then run from the `backend` folder:

```bash
mvn spring-boot:run
```

In this workspace I also downloaded Maven locally under `tools/`, so you can run without global installation:

```powershell
..\tools\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

The API starts at:

```text
http://localhost:5000/api
```

Swagger UI is available at:

```text
http://localhost:5000/swagger-ui.html
```

OpenAPI JSON is available at:

```text
http://localhost:5000/api/docs
```

The H2 console is available at:

```text
http://localhost:5000/h2-console
```

JDBC URL:

```text
jdbc:h2:file:./data/remotep
```

## PostgreSQL Profile

Create the database in pgAdmin:

```sql
CREATE DATABASE remotep;
```

Or use the prepared script from `cmd`:

```cmd
cd /d C:\Users\Asus\outsource-frontend\backend
create-database.cmd
```

Then start the backend with the PostgreSQL profile from `cmd`:

```cmd
set DB_URL=jdbc:postgresql://localhost:5432/remotep
set DB_USERNAME=postgres
set DB_PASSWORD=your_postgres_password
set ADMIN_EMAIL=your_admin_email
set ADMIN_PASSWORD=your_admin_password
set JWT_SECRET=put-a-long-random-secret-here
set SEED_ADMIN_ENABLED=true
run-postgres.cmd
```

You can also use:

```cmd
cd /d C:\Users\Asus\outsource-frontend\backend
run-postgres.local.cmd
```

For ordinary IntelliJ launch in this workspace, `application-postgres.properties` imports the ignored local file:

```text
backend/application-local.properties
```

That local file contains machine-specific credentials and must not be uploaded to GitHub.

After the first start, pgAdmin should show these main tables:

```text
contact_requests
contact_request_comments
contact_request_status_history
portfolio_projects
refresh_tokens
services
telegram_notifications
users
```

When a logged-in user creates a request, `contact_requests.user_id` links that request to `users.id`. Public requests are still allowed and have no linked user.

From `cmd`, check them with:

```cmd
cd /d C:\Users\Asus\outsource-frontend\backend
show-tables.cmd
```

## Telegram Notifications

Telegram notifications are optional. The backend still works if they are disabled.

To enable them, create a bot through `@BotFather`, get the bot token, then get your chat id and run:

```cmd
set TELEGRAM_ENABLED=true
set TELEGRAM_BOT_TOKEN=123456789:your_bot_token
set TELEGRAM_CHAT_ID=123456789
```

Then start the backend in the same `cmd` window. Every new contact request will trigger a Telegram message.

For a local demo, you can use `run-postgres-telegram.local.cmd`. This file is ignored by Git.

For a diploma demo, this is a good flow:

1. Open the public website.
2. Send a contact request.
3. Show that it appears in Telegram.
4. Login as admin.
5. Change status from `NEW` to `IN_PROGRESS`.
6. Set request priority and add an admin comment.
7. Show Telegram delivery status in the admin panel.

## Tests

Run the integration tests from the `backend` folder:

```cmd
..\tools\apache-maven-3.9.11\bin\mvn.cmd test
```

The tests cover:

- registration
- admin login
- public contact request creation
- current user's own contact request list
- content loading from database
- status, priority, and admin comment update
- forbidden contact list without token
- forbidden contact list for a regular user
- successful contact list access for admin
