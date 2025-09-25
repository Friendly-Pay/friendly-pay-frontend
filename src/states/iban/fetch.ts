import { apiClient } from '@/utils/api';

interface BankAccountStatusResponse {
    recipient: string;
    status: 'Idle' | 'InProgress' | 'Activated' | 'Failed';
    verificationStatus: 'Idle' | 'InProgress' | 'NeedAction' | 'Success' | 'Failed';
    balance: number;
    currency: string;
    balanceOnHold: number;
    balanceFrozen: number;
    bankName: string;
    bankAddress: string;
    iban: string;
    swift: string;
}

export const fetchIbanAccountStatus = async () => {
    // const res = await apiClient.get<BankAccountStatusResponse>('/bank-account');
    // return res.data;
    return {
        recipient: 'Igor',
        // status: 'Idle',
        // verificationStatus: 'Idle',
        status: 'Activated',
        verificationStatus: 'Success',
        balance: 1245.67,
        currency: 'EUR',
        balanceOnHold: 120.45,
        balanceFrozen: 0,
        bankName: 'FriendlyPay Bank',
        bankAddress: 'Konstitucijos pr. 21A, LT-08130 Vilnius, Lithuania',
        iban: 'LT601010012345678901',
        swift: 'FRPYLT22',
    } as BankAccountStatusResponse;
};

export const fetchSumsubToken = async () => {
    const res = await apiClient.post<{ token: string }>('/sumsub/generate');
    return res.data;
};

export const startSepaTransfer = async (data: {
    iban: string;
    amount: string;
    recipientType: string;
    recipientName: string;
    details: string;
}) => {
    const res = await apiClient.post<{ success: boolean }>('/bank-account/sepa/transfer', data);
    return res.data;
};