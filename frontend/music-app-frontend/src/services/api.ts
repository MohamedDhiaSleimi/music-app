import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from "../constants/api.constants";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  MessageResponse,
  UserProfile,
} from "../types/auth.types";



import apiClient from './apiClient';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  loginWithGoogle: () => {
    window.location.href = API_ENDPOINTS.OAUTH.GOOGLE;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  deactivateAccount: async (): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.DEACTIVATE_ACCOUNT);
    return response.data;
  },

  cancelDeactivation: async (): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CANCEL_DEACTIVATION);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return response.data;
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    });
    return response.data;
  },
};

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE.GET);
    return response.data;
  },

  updateUsername: async (username: string): Promise<UserProfile> => {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE_USERNAME, {
      username,
    });
    return response.data;
  },

  updateProfilePhoto: async (profilePhotoUrl: string): Promise<UserProfile> => {
    const response = await apiClient.put(API_ENDPOINTS.PROFILE.UPDATE_PHOTO, {
      profilePhotoUrl,
    });
    return response.data;
  },

  removeProfilePhoto: async (): Promise<UserProfile> => {
    const response = await apiClient.delete(API_ENDPOINTS.PROFILE.REMOVE_PHOTO);
    return response.data;
  },

  requestVerification: async (): Promise<MessageResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.PROFILE.REQUEST_VERIFICATION);
    return response.data;
  },
};

