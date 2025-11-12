import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
  UserProfile,
  UpdateUsernameRequest,
  UpdateProfilePhotoRequest,
} from '../types/auth.types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  loginWithGoogle: () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  deactivateAccount: async (): Promise<MessageResponse> => {
    const response = await api.post('/auth/deactivate-account');
    return response.data;
  },

  cancelDeactivation: async (): Promise<MessageResponse> => {
    const response = await api.post('/auth/cancel-deactivation');
    return response.data;
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateUsername: async (username: string): Promise<UserProfile> => {
    const response = await api.put('/profile/username', { username });
    return response.data;
  },

  updateProfilePhoto: async (profilePhotoUrl: string): Promise<UserProfile> => {
    const response = await api.put('/profile/photo', { profilePhotoUrl });
    return response.data;
  },

  removeProfilePhoto: async (): Promise<UserProfile> => {
    const response = await api.delete('/profile/photo');
    return response.data;
  },

  requestVerification: async (): Promise<MessageResponse> => {
    const response = await api.post('/profile/request-verification');
    return response.data;
  },
};

export default api;