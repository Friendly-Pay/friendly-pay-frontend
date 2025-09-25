import {
    BankTransferMethod,
    fetchBankTransferRequiredFields,
    RequiredField,
} from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface State {
    fields: RequiredField[] | null;
    status: FetchStatus;
    lastUpdated: number | null;
    currentCurrency: string | null;
    currentMethod: BankTransferMethod | null;
}

interface Actions {
    load: (params: { currency: string; method: BankTransferMethod }) => Promise<void>;
    clear: () => void;
}

export const useRequiredFieldsStore = create<State & Actions>((set) => ({
    fields: null,
    status: FetchStatus.Idle,
    lastUpdated: null,
    currentCurrency: null,
    currentMethod: null,

    load: async ({ currency, method }) => {
        set({ status: FetchStatus.Pending, currentCurrency: currency, currentMethod: method });
        try {
            const data = await fetchBankTransferRequiredFields(currency, method);
            const fields = [...data].sort((a, b) => a.sorting - b.sorting);
            set({
                fields,
                status: FetchStatus.Fulfilled,
                lastUpdated: Date.now(),
            });
        } catch (error) {
            console.error('[bank-transfer] requiredFields load error:', error);
            set({ status: FetchStatus.Rejected });
        }
    },

    clear: () => set({
        fields: null,
        status: FetchStatus.Idle,
        lastUpdated: null,
        currentCurrency: null,
        currentMethod: null,
    })
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getBankTransferRequiredFieldsStore = () => useRequiredFieldsStore.getState();
}
