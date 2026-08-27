import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  FavoriteAlgorithmResponse,
  ProgressResponse,
  UpdateProgressRequest,
  LearningDashboardResponse,
} from '../types';

export const userActivityService = {
  // Favorites
  async getFavorites(): Promise<FavoriteAlgorithmResponse[]> {
    const response = await apiClient.get<FavoriteAlgorithmResponse[]>(ENDPOINTS.FAVORITES);
    return response.data;
  },

  async addFavorite(slug: string): Promise<FavoriteAlgorithmResponse> {
    const response = await apiClient.post<FavoriteAlgorithmResponse>(
      ENDPOINTS.FAVORITE_BY_SLUG(slug)
    );
    return response.data;
  },

  async removeFavorite(slug: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.FAVORITE_BY_SLUG(slug));
  },

  // Progress Tracking
  async startProgress(slug: string): Promise<ProgressResponse> {
    const response = await apiClient.post<ProgressResponse>(ENDPOINTS.PROGRESS_START(slug));
    return response.data;
  },

  async updateProgress(slug: string, request: UpdateProgressRequest): Promise<ProgressResponse> {
    const response = await apiClient.put<ProgressResponse>(
      ENDPOINTS.PROGRESS_UPDATE(slug),
      request
    );
    return response.data;
  },

  async completeProgress(slug: string): Promise<ProgressResponse> {
    const response = await apiClient.post<ProgressResponse>(ENDPOINTS.PROGRESS_COMPLETE(slug));
    return response.data;
  },

  async getProgress(slug: string): Promise<ProgressResponse> {
    const response = await apiClient.get<ProgressResponse>(ENDPOINTS.PROGRESS_BY_SLUG(slug));
    return response.data;
  },

  async getAllProgress(): Promise<ProgressResponse[]> {
    const response = await apiClient.get<ProgressResponse[]>(ENDPOINTS.PROGRESS);
    return response.data;
  },

  async getDashboard(): Promise<LearningDashboardResponse> {
    const response = await apiClient.get<LearningDashboardResponse>(ENDPOINTS.DASHBOARD);
    return response.data;
  },
};
