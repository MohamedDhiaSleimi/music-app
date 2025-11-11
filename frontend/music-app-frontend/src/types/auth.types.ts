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