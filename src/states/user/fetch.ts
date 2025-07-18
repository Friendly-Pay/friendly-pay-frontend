import { apiClient } from '@/utils/api';

export interface UserRes {
    userId: number;
    email: string | null;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: string | null;
    birthday: string | null;
    country: string | null;
    town: string | null;
    address: string | null;
    postCode: string | null;
    verificationLevel: 'None' | 'Base';
    status: 'Active' | 'Blocked';
}

export const authUser = async ({ webAppData }: { webAppData: string }) => {
    const project = Boolean(import.meta.env.VITE_PROJECT) ? import.meta.env.VITE_PROJECT : undefined;
    const res = await apiClient.post<string>('/user/auth', { webAppData, project });
    return { accessToken: res.data };
    // return { 'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2OTk3Nzc2MzMiLCJuYmYiOjE3NDM2MjY3OTYsImV4cCI6MTc0MzcxMzE5NiwiaWF0IjoxNzQzNjI2Nzk2fQ.O1dj9Hmi-CyXZ-9pgMRg0wIm7wCVxGHg1tjvQDs9q2I' };
};

export const fetchUser = async () => {
    const res = await apiClient.get<UserRes>('/user');
    return res.data;
    // return {
    //     'userId': 434418227,
    //     'status': 'Active',
    //     'phoneNumber': null,
    //     'username': 'gordilovvv',
    //     'firstName': null,
    //     'lastName': null,
    //     'avatar': 'https://t.me/i/userpic/320/SpFYO8SxRt8IPE5DprbjxB3ye6OjY-fXt6VMfkM5dc4.svg',
    //     'country': null,
    //     'birthday': null,
    //     'verificationLevel': 'None'
    // } as UserRes;
};