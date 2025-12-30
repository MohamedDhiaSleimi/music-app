export interface User {
  userId: string;
  email: string;
  username: string;
  profileImageUrl?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  username: string;
  profileImageUrl?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}


export interface EmailRequest {
   email: string;
}


export interface UserProfile {
  userId: string;
  email: string;
  username: string;
  profileImageUrl?: string;
  emailVerified: boolean;
  provider?: string;
  createdAt: string;
  lastLogin: string;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdateProfilePhotoRequest {
  profilePhotoUrl: string;
}