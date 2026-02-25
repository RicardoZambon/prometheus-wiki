export interface AdminUser {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  languagePreference: string;
  roles: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  languagePreference: string;
  roleIds: number[];
}

export interface AppSetting {
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}
