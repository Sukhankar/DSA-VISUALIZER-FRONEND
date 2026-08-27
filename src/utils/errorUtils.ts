import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';

export const getErrorMessage = (error: unknown, fallbackMessage = 'An unexpected error occurred.'): string => {
  if (!error) return fallbackMessage;

  if (typeof error === 'string') return error;

  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.response?.status) {
    switch (axiosError.response.status) {
      case 400:
        return 'Bad Request: Please check your input parameters.';
      case 401:
        return 'Unauthorized: Please log in to continue.';
      case 403:
        return 'Forbidden: You do not have permission to perform this action.';
      case 404:
        return 'Not Found: The requested resource could not be found.';
      case 409:
        return 'Conflict: A resource with these details already exists.';
      case 500:
        return 'Internal Server Error: Something went wrong on the server.';
      default:
        return `Error (${axiosError.response.status}): ${fallbackMessage}`;
    }
  }

  if (axiosError.request) {
    return 'Network Error: Could not connect to the backend server. Please verify backend is running at http://localhost:8080.';
  }

  return axiosError.message || fallbackMessage;
};
