import { BankTransferCurrency, BankTransferMethod, BankTransferTransaction } from './types';
import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';
// import { apiClient } from '@/utils/api';

export const fetchBankTransferCurrencies = async () => {
    const res = await apiClient.get<BankTransferCurrency[]>('/bank-transfer/currencies');
    return res.data;
};

export interface RequiredFieldSelectValue {
    key: string;
    value: string;
}

export type BackendFieldType = 'input' | 'date' | 'select' | 'file';
export type FieldUserType = 'common' | 'receiver' | 'sender';

export interface BackendField {
    fieldName: string;
    fieldTitle: string;
    fieldType: BackendFieldType;
    fieldDescription: string;
    fieldUserType: FieldUserType;
    selectValues: RequiredFieldSelectValue[];
    min: number | null;
    max: number | null;
    regex: string | null;
    fixedValue: string;
    sorting: number;
}

/** Получить обязательные поля по валюте и методу перевода */
export const fetchBankTransferRequiredFields = async (currency: string, method: BankTransferMethod) => {
    const res = await apiClient.get<BackendField[]>(
        '/bank-transfer/required-fields',
        { params: { currency, method } }
    );
    return res.data;
};

/** Получить поля которые запросил банк */
export const fetchBankTransferTransactionRequiredFields = async (transactionId: number): Promise<BackendField[]> => {
    const res = await apiClient.get<BackendField[]>(`/bank-transfer/transactions/${transactionId}/required-fields`);
    return res.data;
};

export const fetchBankTransferTransactions = async (): Promise<BankTransferTransaction[]> => {
    const res = await apiClient.get<BankTransferTransaction[]>('/bank-transfer/transactions');
    return res.data;
};

export interface UploadFileResponse {
    fileId: string;
}

export const uploadBankTransferFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<UploadFileResponse>('/bank-transfer/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export interface CreateTransactionPayload {
    method: BankTransferMethod;
    payoutCurrency: string;
    payoutAmount: number;
    [key: string]: any;
}

export interface CreateTransactionResponse {
    transactionId: number;
    sourceAmount: number;
    walletAddress: string;
}

export const createBankTransferTransaction = async (payload: {
    method: BankTransferMethod;
    payoutCurrency: string;
    payoutAmount: number;
    [key: string]: any;
}): Promise<CreateTransactionResponse> => {
    const res = await apiClient.post<CreateTransactionResponse>(
        '/bank-transfer/transactions/create',
        payload
    );
    return res.data;
};


export interface BankTransferPaymentStatusResponse {
    status: 'WaitingPayment' | 'InProgress' | 'Success' | 'Failed' | 'Expired';
}

export const fetchBankTransferTransactionStatus = async (transactionId: number) => {
    const res = await apiClient.get<BankTransferPaymentStatusResponse>(`https://friendlypay.me/api/bank-transfer/transactions/${transactionId}`);
    return res.data;
};
