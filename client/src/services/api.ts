import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // For sending cookies (refresh token)
});

// Interceptor for appending access token if needed, though we can use cookies for both.
// Let's assume the access token is returned in login and stored in memory for now, or just rely on the backend cookie.
// The backend is setting `accessToken` as an HttpOnly cookie, so we don't strictly need to send it via header unless we choose to.
// But the user requested robust auth, so keeping it in memory via zustand and sending as Bearer token is a standard approach, with HttpOnly refresh token.
// The backend in authController.ts sets both accessToken and refreshToken as HttpOnly cookies.
// However, cross-origin requests on localhost might block cookies unless SameSite=None is used.
// To ensure reliable authentication, we will use the Bearer token stored in the zustand store.

api.interceptors.request.use((config) => {
  const storageStr = localStorage.getItem('auth-storage');
  if (storageStr) {
    try {
      const storage = JSON.parse(storageStr);
      if (storage?.state?.token) {
        config.headers.Authorization = `Bearer ${storage.state.token}`;
      }
    } catch (e) {
      // Ignore parse error
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        // Update the token in storage
        const storageStr = localStorage.getItem('auth-storage');
        if (storageStr) {
          try {
            const storage = JSON.parse(storageStr);
            if (storage?.state) {
              storage.state.token = refreshResponse.data.data.accessToken;
              localStorage.setItem('auth-storage', JSON.stringify(storage));
              originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
            }
          } catch (e) {}
        }
        
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
