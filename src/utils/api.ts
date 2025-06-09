import { useAuthStore } from '@/states/auth/store';
import axios from 'axios';

enum FetchStatus {
    Idle = 'idle',
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        delete config.headers.Authorization;
    }

    return config;
});

apiClient.interceptors.request.use((config) => config);
apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export { apiClient, FetchStatus };