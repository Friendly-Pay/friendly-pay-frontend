import { AuthResponse } from '../auth/fetch';
import { apiClient } from '@/utils/api';

export type EmailVerificationCodeError = 'NotValid' | 'Expired';

export interface SignUpErrorResponse {
    error: EmailVerificationCodeError
}

export const signUpUser = async (data: {
    email: string;
    verificationCode: string;
    webAppData: string;
    referralId?: string | null;
}): Promise<AuthResponse> => {
    const project = import.meta.env.VITE_PROJECT;
    const res = await apiClient.post<AuthResponse>('/user/telegram/sign-up', { ...data, project });
    return res.data;
    // await new Promise<void>(r => setTimeout(r, 500));
    // return { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI4NDkzNTQ4NjE2IiwiUHJvamVjdCI6IkZyaWVuZGx5UGF5IiwibmJmIjoxNzYyOTQyNjUzLCJleHAiOjE3NjMwMjkwNTMsImlhdCI6MTc2Mjk0MjY1M30.dzVbfMWLYeB91zg0tgKc5-7JCPJo5BEsq6C-7WOWWto' };
};

export const sendEmailVerificationCode = async (email: string): Promise<void> => {
    const project = import.meta.env.VITE_PROJECT;
    await apiClient.post<void>('/user/sign-up/verification-code', { email, project });
    // await new Promise<void>(r => setTimeout(r, 500));
};