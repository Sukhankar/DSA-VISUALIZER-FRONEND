import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  ProblemDetail,
  ProblemPageResponse,
  ProblemQueryParams,
} from '../types';

export const problemService = {
  async getProblems(params?: ProblemQueryParams): Promise<ProblemPageResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.difficulty) queryParams.difficulty = params.difficulty;
    if (params?.category) queryParams.category = params.category;
    if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.size !== undefined) queryParams.size = params.size;

    const response = await apiClient.get<ProblemPageResponse>(ENDPOINTS.PROBLEMS, {
      params: queryParams,
    });
    return response.data;
  },

  async getProblemBySlug(slug: string): Promise<ProblemDetail> {
    const response = await apiClient.get<ProblemDetail>(ENDPOINTS.PROBLEM_BY_SLUG(slug));
    return response.data;
  },
};
