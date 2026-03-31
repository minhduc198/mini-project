/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '@/src/lib/http';
import { LoginResponse, RegisterResponse } from '../types';

export class AuthService {
  static async register(email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await http.post('/auth/register', { email, password });
      return response.data as RegisterResponse;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      throw new Error(errMessage);
    }
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await http.post('/auth/login', { email, password });
      return response.data as LoginResponse;
    } catch (error: any) {
      const errMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      throw new Error(errMessage);
    }
  }
}

export const register = (email: string, password: string) => AuthService.register(email, password);

export const login = (email: string, password: string) => AuthService.login(email, password);
