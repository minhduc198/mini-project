export interface AuthUser {
  id: number;
  email: string;
  createdAt?: string;
}

export interface LoginResponse {
  data: { user: AuthUser; token: string };
}

export interface RegisterResponse {
  user: AuthUser;
}
