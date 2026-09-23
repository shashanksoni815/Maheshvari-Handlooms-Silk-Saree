import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // For sending cookies (refresh token)
});

// Interceptor for appending access token if needed, though we can use cookies for both.
// Let's assume the access token is returned in login and stored in memory for now, or just rely on the backend cookie.
// The backend is setting `accessToken` as an HttpOnly cookie, so we don't strictly need to send it via header unless we choose to.
// But the user requested robust auth, so keeping it in memory via zustand and sending as Bearer token is a standard approach, with HttpOnly refresh token.
// Wait, the backend in `authController.ts` sets both `accessToken` and `refreshToken` as HttpOnly cookies.
// AND it returns the accessToken in the JSON payload.
// Let's rely on the HttpOnly cookies for maximum security, but we might need interceptors for token refresh if requests fail with 401.

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login or clear auth store
        if (typeof window !== 'undefined') {
          // Clear local storage or any auth state if necessary
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
