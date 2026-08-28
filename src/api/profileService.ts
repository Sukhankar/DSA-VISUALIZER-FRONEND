import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  UserProfileDto,
  UserProfileUpdateRequest,
  AchievementItemDto,
  BadgeItemDto,
  GamificationSummaryDto,
  StreakStatusDto,
  UserActivityDto,
} from '../types';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const profileService = {
  getProfile: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get<UserProfileDto>(ENDPOINTS.USER_PROFILE_DETAILS);
    return response.data;
  },

  updateProfile: async (request: UserProfileUpdateRequest): Promise<UserProfileDto> => {
    const response = await apiClient.put<UserProfileDto>(ENDPOINTS.USER_PROFILE_DETAILS, request);
    return response.data;
  },

  getAchievements: async (): Promise<AchievementItemDto[]> => {
    const response = await apiClient.get<AchievementItemDto[]>(ENDPOINTS.USER_ACHIEVEMENTS);
    return response.data;
  },

  getBadges: async (): Promise<BadgeItemDto[]> => {
    const response = await apiClient.get<BadgeItemDto[]>(ENDPOINTS.USER_BADGES);
    return response.data;
  },

  getGamificationSummary: async (): Promise<GamificationSummaryDto> => {
    const response = await apiClient.get<GamificationSummaryDto>(ENDPOINTS.USER_GAMIFICATION_SUMMARY);
    return response.data;
  },

  getStreakStatus: async (): Promise<StreakStatusDto> => {
    const response = await apiClient.get<StreakStatusDto>(ENDPOINTS.USER_STREAK_STATUS);
    return response.data;
  },

  getActivities: async (page = 0, size = 15): Promise<PageResponse<UserActivityDto>> => {
    const response = await apiClient.get<PageResponse<UserActivityDto>>(
      `${ENDPOINTS.USER_PROFILE_ACTIVITY}?page=${page}&size=${size}`
    );
    return response.data;
  },
};
