import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

  // NEW: Add this function
  loginWithGoogle: () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },
};

export default api;