import { apiClient } from '@/utils/api';

/** @deprecated */
export const authUserV1 = async ({ webAppData, referralId }: { webAppData: string, referralId?: string | null }) => {
    const res = await apiClient.post<string>('/user/auth', { webAppData, referralId });
    // throw new AxiosError('1234', '401');
    return { accessToken: res.data };
    // return { 'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2OTk3Nzc2MzMiLCJuYmYiOjE3NDM2MjY3OTYsImV4cCI6MTc0MzcxMzE5NiwiaWF0IjoxNzQzNjI2Nzk2fQ.O1dj9Hmi-CyXZ-9pgMRg0wIm7wCVxGHg1tjvQDs9q2I' };
};

export interface UserRes {
    userId: number;
    email: string | null;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: string | null;
    country: string | null;
    status: 'Active' | 'Blocked';
    transactionType: 'Purchase' | 'Deposit' | null;
    purchaseTransaction: InitialPurchaseOrder | null;
    depositTransaction: InitialTopupOrder | null;
    verificationStatus: 'Idle' | 'InProgress' | 'Success' | 'NeedAction' | 'Failed';
    selectedCardTypeId: number | null;
}


// @TODO в сбп я получаю RUB, но у меня в системе SBP
export interface InitialPurchaseOrder {
    transactionId: number;
    expireAt: number;
    cardTypeId: number;
    currency: string;
    amount: number;
    address?: string; // Для криптовалюты
    qrLink?: string; // Для СБП
}

export interface InitialTopupOrder {
    transactionId: number;
    expireAt: number;
    cardId: number;
    currency: string;
    amount: number;
    address?: string; // Для криптовалюты
    qrLink?: string; // Для СБП
}

export const fetchUser = async () => {
    const res = await apiClient.get<UserRes>('/user');
    return res.data;
    // if (import.meta.env.DEV) {
    //     // @ts-ignore
    //     window.setUserVerificationStatus = (verificationStatus: VerificationStatus) => {
    //         const { user, setUser } = useUserStore.getState();
    //         setUser({
    //             ...user!,
    //             verificationStatus
    //         });
    //     };
    // }
    // return {
    //     'userId': 6,
    //     'status': 'Active',
    //     'phoneNumber': null,
    //     'username': 'gordilovvv',
    //     'firstName': null,
    //     'lastName': null,
    //     'email': 'igorgordilov22@gmail.com',
    //     'avatar': 'https://t.me/i/userpic/320/SpFYO8SxRt8IPE5DprbjxB3ye6OjY-fXt6VMfkM5dc4.svg',
    //     // 'selectedCardTypeId': 111035,
    //     'selectedCardTypeId': null,
    //     'country': null,
    //     'verificationStatus': 'Idle',
    //     'transactionType': null,
    //     'depositTransaction': null,
    //     'purchaseTransaction': null
    // };
};


/**
 * Обновление номера телефона пользователя
 */
export const setUserPhoneNumber = async (phoneNumber: string) => {
    await apiClient.post('/user/phone-number', {
        phoneNumber
    });
};