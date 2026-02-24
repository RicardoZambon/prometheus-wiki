export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  languagePreference: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[];
  expiresAt: string;
}
