import { apiClient } from '@/utils/api';

interface ReferralTransaction {
    id: number;
    type: 'PurchaseCard' | 'DepositCard' | 'Withdrawal';
    amount: number;
    cardTypeId: number | null;
    createdAt: number; // Unix timestamp
}

interface ReferralInfoResponse {
    referralId: string;
    balance: number;
    transactions: ReferralTransaction[];
    minWithdrawAmount: number;
}

export const fetchReferralInfo = async () => {
    const res = await apiClient.get<ReferralInfoResponse>('/referral');
    return res.data;

    // return {
    //     referralId: 'mock-referral-id',
    //     balance: 125.5,
    //     minWithdrawAmount: 10,
    //     transactions: [
    //         {
    //             id: 1,
    //             type: 'PurchaseCard',
    //             amount: 50,
    //             cardTypeId: 111028,
    //             createdAt: Date.now() - 86400000, // вчера
    //         },
    //         {
    //             id: 2,
    //             type: 'DepositCard',
    //             amount: 75.5,
    //             createdAt: Date.now() - 3600000, // час назад
    //         },
    //         {
    //             id: 3,
    //             type: 'Withdrawal',
    //             amount: 20,
    //             createdAt: Date.now() - 7200000, // 2 часа назад
    //         },
    //     ],
    // };
};

export const withdrawReferralFunds = async (cardId: number, amount: number) => {
    await apiClient.post<void>('/referral/withdrawal', { cardId, amount });
};