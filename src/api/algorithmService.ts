import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import {
  Algorithm,
  AlgorithmCategory,
  AlgorithmDetailRichResponse,
  AlgorithmPageResponse,
  AlgorithmQueryParams,
} from '../types';

export const algorithmService = {
  async getAlgorithms(params?: AlgorithmQueryParams): Promise<AlgorithmPageResponse> {
    const queryParams: Record<string, any> = {};

    if (params?.category) queryParams.category = params.category;
    if (params?.difficulty) queryParams.difficulty = params.difficulty;
    if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.size !== undefined) queryParams.size = params.size;
    if (params?.sort) queryParams.sort = params.sort;

    const response = await apiClient.get<AlgorithmPageResponse>(ENDPOINTS.ALGORITHMS, {
      params: queryParams,
    });
    return response.data;
  },

  async getAllCategories(): Promise<AlgorithmCategory[]> {
    const response = await apiClient.get<AlgorithmCategory[]>(ENDPOINTS.CATEGORIES);
    return response.data;
  },

  async getAlgorithmBySlug(slug: string): Promise<Algorithm> {
    const response = await apiClient.get<Algorithm>(ENDPOINTS.ALGORITHM_BY_SLUG(slug));
    return response.data;
  },

  async getRichAlgorithmDetails(slug: string): Promise<AlgorithmDetailRichResponse> {
    const response = await apiClient.get<AlgorithmDetailRichResponse>(
      `${ENDPOINTS.ALGORITHM_BY_SLUG(slug)}/details`
    );
    return response.data;
  },

  async getMasteryStatus(slug: string): Promise<{ algorithmSlug: string; mastered: boolean; masteredAt?: string; xpEarned: number; newlyMastered: boolean }> {
    const response = await apiClient.get(`${ENDPOINTS.ALGORITHM_BY_SLUG(slug)}/mastery`);
    return response.data;
  },

  async toggleMastery(slug: string): Promise<{ algorithmSlug: string; mastered: boolean; masteredAt?: string; xpEarned: number; newlyMastered: boolean }> {
    const response = await apiClient.post(`${ENDPOINTS.ALGORITHM_BY_SLUG(slug)}/mastery/toggle`);
    return response.data;
  },
};

export const getAlgorithms = algorithmService.getAlgorithms;
export const getAllCategories = algorithmService.getAllCategories;
export const getAlgorithmBySlug = algorithmService.getAlgorithmBySlug;
export const getRichAlgorithmDetails = algorithmService.getRichAlgorithmDetails;
export const getMasteryStatus = algorithmService.getMasteryStatus;
export const toggleMastery = algorithmService.toggleMastery;

