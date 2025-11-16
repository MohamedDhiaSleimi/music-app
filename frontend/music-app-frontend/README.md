# Music App - Frontend

## Overview
React + TypeScript frontend with Tailwind CSS for the Music App authentication system.

## Prerequisites
- Node.js 18+
- npm or yarn

## Installation
```bash
npm install
```

## Configuration
Copy `.env.example` to `.env` and configure API endpoints.

## Running Locally
```bash
npm run dev
```

Access at `http://localhost:5173`

## Building for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── context/        # React context providers
├── services/       # API service layer
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── constants/      # Application constants
└── utils/          # Utility functions
```

## Features
- Email/password authentication
- Google OAuth2 integration
- Email verification
- Password reset
- Profile management
- Account deactivation

## Technology Stack
- React 18
- TypeScript
- TanStack Query (React Query)
- Tailwind CSS
- Vite
- React Router