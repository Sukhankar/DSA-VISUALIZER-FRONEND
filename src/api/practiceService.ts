import { apiClient } from './axios';
import {

  PracticeArenaOverviewResponse,
  DailyChallengeDto,
  PracticeSessionDto,
  CreatePracticeSessionRequest,
  SessionSubmitRequest,
  SessionSubmitResponse,
} from '../types';

export const practiceService = {
  getArenaOverview: async (): Promise<PracticeArenaOverviewResponse> => {
    const response = await apiClient.get<PracticeArenaOverviewResponse>('/practice/arena');
    return response.data;
  },

  getDailyChallenge: async (): Promise<DailyChallengeDto> => {
    const response = await apiClient.get<DailyChallengeDto>('/practice/daily');
    return response.data;
  },

  createSession: async (request: CreatePracticeSessionRequest): Promise<PracticeSessionDto> => {
    const response = await apiClient.post<PracticeSessionDto>('/practice/sessions', request);
    return response.data;
  },

  getSession: async (sessionId: string): Promise<PracticeSessionDto> => {
    const response = await apiClient.get<PracticeSessionDto>(`/practice/sessions/${sessionId}`);
    return response.data;
  },

  submitInSession: async (
    sessionId: string,
    request: SessionSubmitRequest
  ): Promise<SessionSubmitResponse> => {
    const response = await apiClient.post<SessionSubmitResponse>(
      `/practice/sessions/${sessionId}/submit`,
      request
    );
    return response.data;
  },

  abandonSession: async (sessionId: string): Promise<PracticeSessionDto> => {
    const response = await apiClient.post<PracticeSessionDto>(`/practice/sessions/${sessionId}/abandon`);
    return response.data;
  },

  getSessionHistory: async (page = 0, size = 10) => {
    const response = await apiClient.get(`/practice/history?page=${page}&size=${size}`);
    return response.data;
  },
};
