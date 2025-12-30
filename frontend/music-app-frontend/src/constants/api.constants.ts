export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    DEACTIVATE_ACCOUNT: '/auth/deactivate-account',
    CANCEL_DEACTIVATION: '/auth/cancel-deactivation',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE_USERNAME: '/profile/username',
    UPDATE_PHOTO: '/profile/photo',
    REMOVE_PHOTO: '/profile/photo',
    REQUEST_VERIFICATION: '/profile/request-verification',
  },
  OAUTH: {
    GOOGLE: import.meta.env.VITE_OAUTH_GOOGLE_URL || 'http://localhost:8080/oauth2/authorization/google',
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
};


// Music API Endpoints
export const MUSIC_API_BASE_URL = import.meta.env.VITE_MUSIC_API_BASE_URL || 'http://localhost:3000/api';

export const MUSIC_ENDPOINTS = {
  SONGS: {
    LIST: '/song/list',
    ADD: '/song/add',
    REMOVE: '/song/remove',
  },
  ALBUMS: {
    LIST: '/album/list',
    ADD: '/album/add',
    REMOVE: '/album/remove',
  },
  FAVORITES: {
    LIST: '/favorite/list',
    ADD: '/favorite/add',
    REMOVE: '/favorite/remove',
  },
};
