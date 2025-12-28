import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';


// Платежи криптовалюта
interface TopupCryptoResponse {
    transactionId: number;
    address: string;
    expireAt: number; // Unix timestamp
}

interface CardPurchaseCryptoResponse {
    transactionId: number;
    amount: number;
    address: string;
    expireAt: number; // Unix timestamp
}

export const createTopupCrypto = async ({ cardId, currency }: { cardId: number, currency: string }) => {
    const res = await apiClient.post<TopupCryptoResponse>('/card/deposit', {
        cardId,
        currency
    });
    return res.data;
};

export const createCardPurchaseCrypto = async ({ cardTypeId, currency }: { cardTypeId: number, currency: string }) => {
    const res = await apiClient.post<CardPurchaseCryptoResponse>('/card/purchase', {
        cardTypeId,
        currency
    });
    return res.data;
};


// Платежи СБП
interface TopupSbpResponse {
    transactionId: number;
    qrLink: string;
    expireAt: number; // Unix timestamp
}

interface CardPurchaseSbpResponse {
    transactionId: number;
    amount: number;
    currency: string;
    qrLink: string;
    expireAt: number; // Unix timestamp
}

export const createTopupSbp = async (data: { amountRub: number; cardId: number; }): Promise<TopupSbpResponse> => {
    const res = await apiClient.post<TopupSbpResponse>('/card/deposit/sbp', data);
    return res.data;
    // return {
    //     transactionId: 1764006488,
    //     qrLink: 'https://sbp.nspk.ru/',
    //     expireAt: 1234
    // };
};

export const createPurchaseCardSbp = async (data: { cardTypeId: number; }): Promise<CardPurchaseSbpResponse> => {
    const res = await apiClient.post<CardPurchaseSbpResponse>(
        '/card/purchase/sbp',
        data
    );
    return res.data;
    // return {
    //     transactionId: 1764006488,
    //     amount: 1000,
    //     currency: 'RUB',
    //     qrLink: 'https://sbp.nspk.ru/',
    //     expireAt: 1234
    // };
};

interface SbpRateResponse {
    rate: number;
}

export const fetchSbpRates = async (): Promise<SbpRateResponse> => {
    const res = await apiClient.get<SbpRateResponse>('/rates/RUB');
    return res.data;
    // return { rate: 86.4 };
};


// Статусы платежей
interface TopupStatusResponse {
    status: 'InProgress' | 'Success' | 'Failed' | 'Cancelled';
    amount: number | null,
    fee: number | null,
    currency: string
}

interface CardPurchaseStatusResponse {
    status: 'InProgress' | 'Success' | 'Failed' | 'Cancelled';
    amount: number
    currency: string
}

export const fetchTopupTransactionStatus = async (transactionId: number) => {
    const searchParams = urlSearchParams({ transactionId });
    const res = await apiClient.get<TopupStatusResponse>(`/card/deposit/status?${searchParams}`);
    return res.data;
};

export const fetchPurchaseTransactionStatus = async (transactionId: number) => {
    const searchParams = urlSearchParams({ transactionId });
    const res = await apiClient.get<CardPurchaseStatusResponse>(`/card/purchase/status?${searchParams}`);
    return res.data;
};


// Отмена платежей
export const cancelTopupTransaction = async (transactionId: number) => {
    await apiClient.post<void>('/card/deposit/cancel', { transactionId });
};

export const cancelPurchaseTransaction = async (transactionId: number) => {
    await apiClient.post<void>('/card/purchase/cancel', { transactionId });
};

export interface RatesResponse {
    rate: number;
}

export const fetchRate = async (): Promise<RatesResponse> => {
    const res = await apiClient.get<RatesResponse>('/rates/GPTON');
    return res.data;
};