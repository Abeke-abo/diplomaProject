# RemoteP Deployment Checklist

For diploma defense, local launch is enough. For public deployment, complete this checklist first.

## Required

- Use environment variables for all secrets.
- Do not deploy `backend/application-local.properties`.
- Use a strong `JWT_SECRET`.
- Rotate Telegram bot token if it was ever shared.
- Set PostgreSQL password through server environment variables.
- Build frontend with the production backend URL:

```cmd
set VITE_API_URL=https://your-domain.kz/api
npm run build
```

- Run backend with production variables:

```cmd
set DB_URL=jdbc:postgresql://your-host:5432/remotep
set DB_USERNAME=postgres
set DB_PASSWORD=your_password
set JWT_SECRET=your_long_secret
set ADMIN_EMAIL=your_admin_email
set ADMIN_PASSWORD=your_admin_password
java -jar target\backend-0.0.1-SNAPSHOT.jar
```

## Recommended

- Enable HTTPS.
- Restrict CORS to the real frontend domain.
- Disable Swagger UI on a public production server or protect it.
- Add database backups.
- Add CI checks: `mvn test` and `npm run build`.
- Move static frontend build to Nginx or another web server.
