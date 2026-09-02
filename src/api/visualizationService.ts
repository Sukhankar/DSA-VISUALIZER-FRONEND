import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';
import { VisualizationRequest, VisualizationResponse } from '../types';
import { VisualizationAuditDto, VisualizationContract } from '../types/contract';

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

  async getVisualizationContract(slug: string): Promise<VisualizationContract> {
    const response = await apiClient.get<VisualizationContract>(
      `/api/v1/algorithms/${slug}/visualization-contract`
    );
    return response.data;
  },

  async getAuditReport(): Promise<VisualizationAuditDto> {
    const response = await apiClient.get<VisualizationAuditDto>(
      '/api/v1/admin/visualizations/audit'
    );
    return response.data;
  },
};
