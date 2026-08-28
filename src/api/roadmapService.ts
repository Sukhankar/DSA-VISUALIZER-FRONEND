import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  RoadmapModuleDto,
  AssessmentRequestDto,
  AssessmentResultDto,
  NextRecommendationDto,
  UserRoadmapDto,
  LearningPathDto,
  UserLearningPreferenceDto,
  LearningRecommendationDto,
} from '../types';

export const roadmapService = {
  getUserRoadmap: async (): Promise<RoadmapModuleDto[]> => {
    try {
      const response = await apiClient.get<UserRoadmapDto | RoadmapModuleDto[]>(ENDPOINTS.USER_ROADMAP);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data?.modules || [];
    } catch {
      const fallback = await apiClient.get<RoadmapModuleDto[]>(ENDPOINTS.ROADMAP);
      return fallback.data;
    }
  },

  getUserRoadmapFull: async (): Promise<UserRoadmapDto> => {
    const response = await apiClient.get<UserRoadmapDto>(ENDPOINTS.USER_ROADMAP);
    return response.data;
  },

  getModuleDetails: async (slug: string): Promise<RoadmapModuleDto> => {
    try {
      const response = await apiClient.get<RoadmapModuleDto>(ENDPOINTS.LEARNING_MODULE_DETAILS(slug));
      return response.data;
    } catch {
      const fallback = await apiClient.get<RoadmapModuleDto>(ENDPOINTS.ROADMAP_MODULE_DETAILS(slug));
      return fallback.data;
    }
  },

  startModule: async (slug: string): Promise<RoadmapModuleDto> => {
    const response = await apiClient.post<RoadmapModuleDto>(ENDPOINTS.USER_MODULE_START(slug));
    return response.data;
  },

  submitAssessment: async (request: any): Promise<AssessmentResultDto> => {
    try {
      const response = await apiClient.post<AssessmentResultDto>(ENDPOINTS.LEARNING_ASSESSMENT, request);
      return response.data;
    } catch {
      const fallback = await apiClient.post<AssessmentResultDto>(ENDPOINTS.ROADMAP_ASSESSMENT, request);
      return fallback.data;
    }
  },

  getSmartRecommendation: async (): Promise<LearningRecommendationDto> => {
    try {
      const response = await apiClient.get<LearningRecommendationDto>(ENDPOINTS.USER_RECOMMENDATIONS);
      return response.data;
    } catch {
      const fallback = await apiClient.get<NextRecommendationDto>(ENDPOINTS.ROADMAP_RECOMMENDATIONS);
      return {
        type: fallback.data.stepType || 'ALGORITHM',
        title: fallback.data.stepTitle || fallback.data.moduleTitle,
        description: fallback.data.recommendationReason,
        slug: fallback.data.moduleSlug,
        progress: 35,
        xpReward: fallback.data.xpReward,
        actionLabel: 'Continue Learning',
        actionUrl: fallback.data.actionUrl,
      };
    }
  },

  getLearningPaths: async (): Promise<LearningPathDto[]> => {
    const response = await apiClient.get<LearningPathDto[]>(ENDPOINTS.LEARNING_PATHS);
    return response.data;
  },

  getLearningPreferences: async (): Promise<UserLearningPreferenceDto> => {
    const response = await apiClient.get<UserLearningPreferenceDto>(ENDPOINTS.USER_LEARNING_PREFERENCES);
    return response.data;
  },

  updateLearningPreferences: async (pref: Partial<UserLearningPreferenceDto>): Promise<UserLearningPreferenceDto> => {
    const response = await apiClient.put<UserLearningPreferenceDto>(ENDPOINTS.USER_LEARNING_PREFERENCES, pref);
    return response.data;
  },
};
