import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CurrentUserResponse,
} from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH_LOGIN,
      credentials
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      ENDPOINTS.AUTH_REGISTER,
      data
    );
    return response.data;
  },

  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>(
      ENDPOINTS.USER_PROFILE
    );
    return response.data;
  },
};
