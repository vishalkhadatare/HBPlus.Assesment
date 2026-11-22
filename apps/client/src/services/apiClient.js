import config from '../config/environment.js';
import { auth } from '../config/firebase.js';

/**
 * Reusable HTTP API Client with automatic Firebase Bearer Token injection.
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Retrieves the current user's Firebase ID token.
   * Forces refresh if close to expiration.
   */
  async getIdToken(forceRefresh = false) {
    try {
      if (auth && auth.currentUser) {
        return await auth.currentUser.getIdToken(forceRefresh);
      }
    } catch (err) {
      console.warn('[ApiClient] Failed to retrieve Firebase ID token:', err.message);
    }
    return null;
  }

  /**
   * Dispatches an HTTP request with JSON parsing and standardized error handling.
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers
    };

    // Attach Bearer token if not explicitly disabled
    if (!options.skipAuth) {
      const token = await this.getIdToken(options.forceTokenRefresh);
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Safe JSON parsing
      let responseData;
      const text = await response.text();
      try {
        responseData = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        responseData = { message: text || response.statusText };
      }

      if (!response.ok) {
        const error = new Error(responseData.message || `HTTP Error ${response.status}`);
        error.status = response.status;
        error.code = responseData.code || `HTTP_${response.status}`;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        const timeoutErr = new Error('Network request timed out. Please check your connection.');
        timeoutErr.code = 'REQUEST_TIMEOUT';
        throw timeoutErr;
      }

      // Re-throw standardized API error
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(config.API_BASE_URL);
export default apiClient;
