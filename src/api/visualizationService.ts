import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { VisualizationRequest, VisualizationResponse } from '../types';

export const visualizationService = {
  async generateVisualization(
    slug: string,
    request: VisualizationRequest
  ): Promise<VisualizationResponse> {
    const response = await apiClient.post<VisualizationResponse>(
      ENDPOINTS.VISUALIZE_ALGORITHM(slug),
      request
    );
    return response.data;
  },
};
