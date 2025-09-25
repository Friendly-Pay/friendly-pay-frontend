import { apiClient } from '@/utils/api';

export type BankTransferMethod = 'BankTransfer' | 'GlobalBankTransfer';

export interface BankTransferCurrency {
    currency: string;
    method: BankTransferMethod;
    country: string;
    feeRate: number; // (с добавочным нашим процентом)
    feeMin: number;  // (с добавочным нашим процентом)
    minAmount: number;
    maxAmount: number;
    exchangeRate: number; // (между USD и отправляемой валютой)
}

export const fetchBankTransferCurrencies = async () => {
    const res = await apiClient.get<BankTransferCurrency[]>('/bank-transfer/currencies');
    return res.data;
};

export interface RequiredFieldSelectValue {
    key: string;
    value: string;
}

export type RequiredFieldType = 'input' | 'date' | 'select' | 'file';
export type FieldUserType = 'common' | 'receiver' | 'sender';

export interface RequiredField {
    fieldName: string;
    fieldTitle: string;
    fieldType: RequiredFieldType;
    fieldDescription: string;
    fieldUserType: FieldUserType;
    selectValues: RequiredFieldSelectValue[];
    min: number | null;
    max: number | null;
    regex: string | null;
    fixedValue: string;
    sorting: number;
}

export const fetchBankTransferRequiredFields = async (currency: string, method: BankTransferMethod) => {
    const res = await apiClient.get<RequiredField[]>(
        '/bank-transfer/required-fields',
        { params: { currency, method } }
    );
    return res.data;
};
