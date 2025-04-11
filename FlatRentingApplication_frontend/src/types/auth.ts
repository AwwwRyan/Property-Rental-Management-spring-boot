export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'TENANT' | 'LANDLORD';
}

export type UserRole = 'TENANT' | 'LANDLORD';

export interface LoginResponse {
  accessToken: string;
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthError {
  message: string;
  status: number;
} 