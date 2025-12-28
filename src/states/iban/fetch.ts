import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';

interface IbanAccountResponse {
    status: 'Idle' | 'InProgress' | 'Success' | 'Failed';
    balance: number | null;
    currency: string | null;
    balanceOnHold: number | null;
    balanceFrozen: number | null;
    bankName: string | null;
    bankAddress: string | null;
    iban: string | null;
    swift: string | null;
    recipient: string | null;
    available: boolean;
}

export const fetchIbanAccountStatus = async () => {
    const res = await apiClient.get<IbanAccountResponse>('/bank-account');
    return res.data;
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

interface IbanTransaction {
    id: number;
    type: 'DEPOSIT' | 'PAYMENT';
    status:
    | 'NEW'
    | 'PENDING'
    | 'PENDING_EXTERNALLY'
    | 'PENDING_FX'
    | 'APPROVAL'
    | 'EMAIL_APPROVAL'
    | 'LEGAL_APPROVAL'
    | 'LEGAL_APPROVED'
    | 'APPROVED'
    | 'APPROVED_BY_RISK_MANAGER'
    | 'APPROVED_BY_COMPLIANCE_MANAGER'
    | 'REJECTED'
    | 'COMPLETED'
    | 'CANCELED'
    | 'ERROR'
    | 'FAILED'
    | 'REVERTED';
    amount: number;
    currency: string;
    original_amount: number;
    original_currency: string;
    senderName: string;
    receiverName: string;
    details: string;
    createdAt: number;
}

export const fetchIbanTransactions = async (params: { limit: number; offset: number }) => {
    const searchParams = urlSearchParams(params);
    const url = `/bank-account/transactions?${searchParams}`;
    const res = await apiClient.get<IbanTransaction[]>(url);
    return res.data;
};

export const activateIbanAccount = async () => {
    await apiClient.post<void>('/bank-account/activate');
};