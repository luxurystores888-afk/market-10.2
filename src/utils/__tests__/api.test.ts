/**
 * @jest-environment node
 */
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the API utilities
jest.mock('../api', () => ({
  apiRequest: mockFetch,
}));

import { apiRequest } from '../api';

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: 'mock response' }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('apiRequest', () => {
    it('makes a GET request by default', async () => {
      const result = await apiRequest('/test');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual({ success: true, data: 'mock response' });
    });

    it('makes a POST request when specified', async () => {
      await apiRequest('/test', 'POST', { data: 'test' });

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      });
    });

    it('includes authorization header when token is provided', async () => {
      await apiRequest('/test', 'GET', null, 'test-token');

      expect(mockFetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
      });
    });

    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiRequest('/test')).rejects.toThrow('Network error');
    });

    it('handles HTTP errors with proper error messages', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(apiRequest('/test')).rejects.toThrow('HTTP 404: Not found');
    });

    it('handles responses without JSON content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => 'Plain text response',
      });

      const result = await apiRequest('/test');
      expect(result).toBe('Plain text response');
    });
  });
});
