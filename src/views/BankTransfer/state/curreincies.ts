import { fetchBankTransferCurrencies } from './fetch'; // Ваша fetch-функция
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface Currency {
    currency: string;
    method: string;
    country: string;
    feeRate: number;
    feeMin: number;
    minAmount: number;
    maxAmount: number;
    exchangeRate: number;
}

interface BankTransferCurrenciesState {
    bankTransferCurrencies: Currency[];
    globalBankTransferCurrencies: Currency[];
    status: FetchStatus;
    error: string | null;
    load: () => Promise<void>;
    clear: () => void;
}

export const useBankTransferCurrenciesStore = create<BankTransferCurrenciesState>()(
    (set) => ({
        bankTransferCurrencies: [],
        globalBankTransferCurrencies: [],
        status: FetchStatus.Idle,
        error: null,
        updateInterval: null,

        load: async () => {
            set({ status: FetchStatus.Pending });
            try {
                const currencies = await fetchBankTransferCurrencies();
                const bankTransfer = currencies.filter(c => c.method === 'BankTransfer');
                const globalTransfer = currencies.filter(c => c.method === 'GlobalBankTransfer');

                set({
                    bankTransferCurrencies: bankTransfer,
                    globalBankTransferCurrencies: globalTransfer,
                    status: FetchStatus.Fulfilled,
                    error: null,
                });
            } catch (error) {
                set({
                    status: FetchStatus.Rejected,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        },

        clear: () => {
            set({
                bankTransferCurrencies: [],
                globalBankTransferCurrencies: [],
                status: FetchStatus.Idle,
                error: null,
            });
        },
    })
);