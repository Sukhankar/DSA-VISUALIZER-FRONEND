import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  ProblemUserStatsResponse,
  RunCodeRequest,
  RunCodeResponse,
  SubmitCodeRequest,
  SubmissionResponse,
} from '../types';

export const submissionService = {
  async runCode(slug: string, request: RunCodeRequest): Promise<RunCodeResponse> {
    const response = await apiClient.post<RunCodeResponse>(
      ENDPOINTS.PROBLEM_RUN(slug),
      request
    );
    return response.data;
  },

  async submitCode(slug: string, request: SubmitCodeRequest): Promise<SubmissionResponse> {
    const response = await apiClient.post<SubmissionResponse>(
      ENDPOINTS.PROBLEM_SUBMIT(slug),
      request
    );
    return response.data;
  },

  async getProblemSubmissions(slug: string): Promise<SubmissionResponse[]> {
    const response = await apiClient.get<SubmissionResponse[]>(
      ENDPOINTS.PROBLEM_SUBMISSIONS(slug)
    );
    return response.data;
  },

  async getUserSubmissions(page = 0, size = 10): Promise<{ content: SubmissionResponse[]; totalPages: number }> {
    const response = await apiClient.get<{ content: SubmissionResponse[]; totalPages: number }>(
      ENDPOINTS.USER_SUBMISSIONS,
      { params: { page, size } }
    );
    return response.data;
  },

  async getUserProblemStats(): Promise<ProblemUserStatsResponse> {
    const response = await apiClient.get<ProblemUserStatsResponse>(
      ENDPOINTS.USER_PROBLEM_STATS
    );
    return response.data;
  },
};
