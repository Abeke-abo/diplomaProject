RemoteP

RemoteP is a diploma backend application for an IT outsourcing agency. The project includes a public website, user registration and login, personal cabinet, admin panel, PostgreSQL database, Telegram notifications, and documented REST API.

Stack

- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT, Springdoc OpenAPI
- Database: PostgreSQL for the main profile, H2 for tests
- Tools: Maven, pgAdmin, Postman collection, Swagger UI

Architecture

The backend follows a layered architecture:

- Controller: receives HTTP requests and returns JSON
- Service: contains business logic and validation
- Repository: works with PostgreSQL through Spring Data JPA
- Entity: describes database tables
- DTO: separates API data from database entities

## Local Run

Backend:
cd /d C:\Users\Asus\outsource-frontend\backend
C:\Users\Asus\.jdks\openjdk-23.0.2\bin\java.exe -jar target\backend-0.0.1-SNAPSHOT.jar



Open:
Frontend: http://localhost:5173
Backend health: http://localhost:5000/api/health
Swagger UI: http://localhost:5000/swagger-ui.html
OpenAPI JSON: http://localhost:5000/api/docs
