import { API_BASE_URL, defaultHeaders } from './api';
import { LoginRequest, LoginResponse, AuthError, SignupRequest } from '@/types/auth';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error: AuthError = {
          message: 'Invalid credentials',
          status: response.status,
        };
        throw error;
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message, status: 401 };
      }
      throw error;
    }
  }

  static async signup(userData: SignupRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error: AuthError = {
          message: 'Registration failed',
          status: response.status,
        };
        throw error;
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message, status: 401 };
      }
      throw error;
    }
  }
} 