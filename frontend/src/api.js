import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true 
});

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true;
            
            try {
                // Attempt refresh
                const res = await axiosInstance.post('/auth/refresh');
                const newAccessToken = res.data.accessToken;
                
                setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const api = {

    // Auth
    login: (credentials) => axiosInstance.post('/auth/login', credentials)
    .then(res => res.data),

    register: (credentials) => axiosInstance.post('/auth/register', credentials)
    .then(res => res.data),

    logout: () => axiosInstance.post('/auth/logout')
    .then(res => res.data),

    refresh: () => axiosInstance.post('/auth/refresh')
    .then(res => res.data),

    // Levels
    getLevels: () => axiosInstance.get('/levels')
    .then(res => res.data),

    createLevel: (level) => axiosInstance.post('/levels', level)
    .then(res => res.data),

    // Scores
    getLeaderboard: (levelId) => axiosInstance.get(`/scores/${levelId}`)
    .then(res => res.data),
    
    submitScore: (score) => axiosInstance.post('/scores', score)
    .then(res => res.data),
};