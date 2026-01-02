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
- Playback queue management (modal to view/reorder/remove, add to queue from player or cards)
- Album/playlist play-all controls and loop/shuffle modes
- Local recommendation model (content-based, uses enriched audio metadata) with downloadable seed weights
- Unified song data model lives in `src/types/music.types.ts` (artist, genre, BPM, key, audio feature scores, release year)

## Technology Stack
- React 18
- TypeScript
- TanStack Query (React Query)
- Tailwind CSS
- Vite
- React Router

## Recent Improvements

### Component Abstractions
- **AuthPageLayout**: Consistent layout for all authentication pages
- **PasswordInput**: Reusable password input with visibility toggle
- **Avatar**: Unified user avatar display component
- **GoogleOAuthButton**: Extracted OAuth button for reuse

### Custom Hooks
- **useForm**: Generic form handling with validation support
- **useNotification**: Notification state management with auto-dismiss

### API Layer
- Centralized Axios client configuration with interceptors
- Global 401 error handling
- Simplified API method signatures

### Code Quality
- Removed redundant type definitions
- Consistent use of UI constants across components
- Improved error handling patterns

## Playback & Queue
- Open the queue from the player bar ("Queue" button) to view, reorder, remove, or clear items.
- Add songs to the queue from any song card or from the player ("+ Queue").
- Play an entire album/playlist via the play-all buttons on their detail screens.

## Recommendation Model
- `src/utils/recommendationPlaceholder.ts` now exports `getRecommendations(input, catalog)` implementing a local content-based recommender using BPM, energy, danceability, valence, acousticness, instrumentalness, liveness, and speechiness.
- Song entities now include richer metadata fields (artist, genre, bpm, key, releaseYear, and audio feature scores). Missing values are deterministically backfilled client-side for consistency.
- A lightweight seed model file is stored locally at `public/models/sample_model.json` (downloaded), ready to be swapped with a heavier model when available.
