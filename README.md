# Music App - Full Stack Authentication System

Complete authentication system with Spring Boot backend and React frontend.

## Project Structure

```
music-app/
├── backend/
│   └── auth-service/     # Spring Boot authentication service
└── frontend/
    └── music-app-frontend/  # React TypeScript frontend
```

## Quick Start

### Backend

```bash
cd backend/auth-service
cp .env.example .env
# Configure .env
mvn spring-boot:run
```

### Frontend

```bash
cd frontend/music-app-frontend
cp .env.example .env
npm install
npm run dev
```

## Features

- ✅ User registration and login
- ✅ Google OAuth2 integration
- ✅ Email verification with tokens
- ✅ Password reset flow
- ✅ Profile management (username, photo)
- ✅ Account deactivation with grace period
- ✅ JWT-based authentication
- ✅ MongoDB data persistence

## Documentation

- [Backend README](./backend/auth-service/README.md)
- [Frontend README](./frontend/music-app-frontend/README.md)

## License

MIT
