import { apiClient } from '@/utils/api';

export interface VerificationPayload {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    // country: string;
    birthday: string;
}

export interface VerificationResponse {
    status: number;
}

export const completeVerificationLevel1 = async (data: VerificationPayload) => {
    const res = await apiClient.post<VerificationResponse>('/user/verification', data);
    return res.data;
};