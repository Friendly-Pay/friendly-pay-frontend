import { apiClient } from '@/utils/api';

export interface AuthResponse {
    token: string;
}

export const authUser = async (data: {
    webAppData: string;
    referralId: string | null | undefined;
}) => {
    const project = import.meta.env.VITE_PROJECT;
    const res = await apiClient.post<AuthResponse>('/user/telegram/sign-in', { ...data, project });
    return res.data;
};