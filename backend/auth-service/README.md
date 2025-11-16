# Music App - Authentication Service

## Overview
Spring Boot-based authentication service providing user registration, login, OAuth2 integration, email verification, and profile management.

## Prerequisites
- Java 17+
- Maven 3.6+
- MongoDB 4.4+

## Configuration
Copy `.env.example` to `.env` and configure:
- MongoDB connection
- Email SMTP settings
- Google OAuth2 credentials
- JWT secret key

## Running Locally
```bash
mvn spring-boot:run
```

## Building
```bash
mvn clean package
```

## Running Tests
```bash
mvn test
```

## API Documentation
The service runs on `http://localhost:8080`

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/resend-verification` - Resend verification email

### Protected Endpoints (Requires JWT)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/deactivate-account` - Request account deactivation
- `POST /api/auth/cancel-deactivation` - Cancel deactivation
- `GET /api/profile` - Get user profile
- `PUT /api/profile/username` - Update username
- `PUT /api/profile/photo` - Update profile photo
- `DELETE /api/profile/photo` - Remove profile photo
- `POST /api/profile/request-verification` - Request email verification

## Environment Variables
See `.env.example` for all available configuration options.