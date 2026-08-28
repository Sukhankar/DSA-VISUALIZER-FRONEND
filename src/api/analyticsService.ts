import { apiClient } from './axios';
import {
  AnalyticsOverviewResponse,
  BadgeDto,
  DailyActivityDto,
  LeaderboardUserDto,
  TopicSkillDto
} from '../types';

export const analyticsService = {
  getOverview: async (): Promise<AnalyticsOverviewResponse> => {
    const response = await apiClient.get<AnalyticsOverviewResponse>('/analytics/overview');
    return response.data;
  },

  getHeatmap: async (): Promise<DailyActivityDto[]> => {
    const response = await apiClient.get<DailyActivityDto[]>('/analytics/heatmap');
    return response.data;
  },

  getSkills: async (): Promise<TopicSkillDto[]> => {
    const response = await apiClient.get<TopicSkillDto[]>('/analytics/skills');
    return response.data;
  },

  getBadges: async (): Promise<BadgeDto[]> => {
    const response = await apiClient.get<BadgeDto[]>('/analytics/badges');
    return response.data;
  },

  getLeaderboard: async (limit: number = 10): Promise<LeaderboardUserDto[]> => {
    const response = await apiClient.get<LeaderboardUserDto[]>(`/analytics/leaderboard?limit=${limit}`);
    return response.data;
  },

  getXpTimeline: async (): Promise<DailyActivityDto[]> => {
    const response = await apiClient.get<DailyActivityDto[]>('/analytics/xp-timeline');
    return response.data;
  }
};

