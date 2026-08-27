import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { AlgorithmCategory } from '../types';

export const getCategories = async (): Promise<AlgorithmCategory[]> => {
  const response = await apiClient.get<AlgorithmCategory[]>(ENDPOINTS.CATEGORIES);
  return response.data;
};

export const categoryService = {
  getCategories,
};
