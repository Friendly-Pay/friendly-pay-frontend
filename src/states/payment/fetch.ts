import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';

export interface CardDepositResponse {
    transactionId: number;
    address: string;
    expireAt: number; // Unix timestamp
}

export const makeCardDeposit = async (cardId: number): Promise<CardDepositResponse> => {
    const res = await apiClient.post<CardDepositResponse>('/card/deposit', {
        cardId
    });
    return res.data;
};

export interface CardPurchaseResponse {
    transactionId: number;
    amount: number;
    currency: string;
    address: string;
    expireAt: number;
}

export const purchaseCard = async (cardTypeId: number) => {
    const res = await apiClient.post<CardPurchaseResponse>('/card/purchase', { cardTypeId });
    return res.data;
};

export interface TopupStatusResponse {
    status: 'InProgress' | 'Success' | 'Failed' | 'Cancelled';
    amount?: number,
    currency?: string
}

export const fetchTopupStatus = async (
    transactionId: number,
    abortSignal?: AbortSignal
) => {
    const searchParams = urlSearchParams({ transactionId });
    const res = await apiClient.get<TopupStatusResponse>(
        `/card/deposit/status?${searchParams}`,
        { signal: abortSignal }
    );
    return res.data;
};

export const cancelTopup = async (transactionId: number) => {
    await apiClient.post<void>('/card/deposit/cancel', { transactionId });
};

export interface PurchaseStatusResponse {
    status: 'InProgress' | 'Success' | 'Failed' | 'Cancelled';
}

export const fetchPurchaseStatus = async (
    transactionId: number,
    abortSignal?: AbortSignal
) => {
    const searchParams = urlSearchParams({ transactionId });
    const res = await apiClient.get<PurchaseStatusResponse>(
        `/card/purchase/status?${searchParams}`,
        { signal: abortSignal }
    );
    return res.data;
};

export const cancelPurchase = async (transactionId: number) => {
    await apiClient.post<void>('/card/purchase/cancel', { transactionId });
};