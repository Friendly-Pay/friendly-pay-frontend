import { BackendField, fetchBankTransferRequiredFields, fetchBankTransferTransactionRequiredFields } from './fetch';
import { BankTransferMethod } from './types';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface State {
    fields: BackendField[] | null;
    status: FetchStatus;
    lastUpdated: number | null;
    complianceAdditional: boolean // Когда банк запросил документы
}

interface Actions {
    loadCurrencyFields: (params: { currency: string; method: BankTransferMethod }) => Promise<void>;
    loadTransactionFields: (transactionId: number) => Promise<void>;
    reset: () => void;
}

export const useBankTransferRequiredFields = create<State & Actions>((set) => ({
    fields: null,
    status: FetchStatus.Idle,
    lastUpdated: null,
    complianceAdditional: false,

    loadCurrencyFields: async ({ currency, method }) => {
        set({ status: FetchStatus.Pending });
        try {
            const data = await fetchBankTransferRequiredFields(currency, method);
            const fields = [...data].filter(field => field.fieldName !== 'transferAmount' && field.fieldName !== 'payoutMethod' && field.fieldName !== 'payoutCurrency' && field.fieldName !== 'transferType').sort((a, b) => a.sorting - b.sorting);
            set({
                fields,
                status: FetchStatus.Fulfilled,
                lastUpdated: Date.now(),
                complianceAdditional: false
            });
        } catch (error) {
            console.error('[bank-transfer] requiredFields load error:', error);
            set({ status: FetchStatus.Rejected });
        }
    },

    loadTransactionFields: async (transactionId: number) => {
        set({ status: FetchStatus.Pending });
        try {
            const data = await fetchBankTransferTransactionRequiredFields(transactionId);
            const fields = [...data].sort((a, b) => a.sorting - b.sorting);
            set({
                fields,
                status: FetchStatus.Fulfilled,
                lastUpdated: Date.now(),
                complianceAdditional: true
            });
        } catch (error) {
            console.error('[bank-transfer] transaction requiredFields load error:', error);
            set({ status: FetchStatus.Rejected });
        }
    },

    reset: () => set({
        fields: null,
        status: FetchStatus.Idle,
        lastUpdated: null,
        complianceAdditional: false
    })
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getBankTransferRequiredFieldsStore = () => useRequiredFieldsStore.getState();
}
