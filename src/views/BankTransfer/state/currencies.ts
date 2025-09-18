import { fetchBankTransferCurrencies } from './fetch'; // Ваша fetch-функция
import { BankTransferCurrency } from './types';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface BankTransferCurrenciesState {
    bankTransferCurrencies: BankTransferCurrency[];
    globalBankTransferCurrencies: BankTransferCurrency[];
    bankTransferCountries: string[]; // Уникальные коды стран для BankTransfer
    globalBankTransferCountries: string[]; // Уникальные коды стран для GlobalBankTransfer
    status: FetchStatus;
    error: string | null;
    loadCurrencies: () => Promise<void>;
    reset: () => void;
}

const getUniqueCountries = (currencies: BankTransferCurrency[]): string[] => {
    const countriesSet = new Set<string>();
    currencies.forEach(currency => countriesSet.add(currency.country));
    return Array.from(countriesSet).sort();
};

export const useBankTransferCurrenciesStore = create<BankTransferCurrenciesState>()(
    (set) => ({
        bankTransferCurrencies: [],
        globalBankTransferCurrencies: [],
        bankTransferCountries: [],
        globalBankTransferCountries: [],
        status: FetchStatus.Idle,
        error: null,
        updateInterval: null,

        loadCurrencies: async () => {
            set({ status: FetchStatus.Pending });
            try {
                const currencies = await fetchBankTransferCurrencies();
                const bankTransfer = currencies.filter(c => c.method === 'BankTransfer');
                const globalTransfer = currencies.filter(c => c.method === 'GlobalBankTransfer');
                const bankTransferCountries = getUniqueCountries(bankTransfer);
                const globalBankTransferCountries = getUniqueCountries(globalTransfer);

                set({
                    bankTransferCurrencies: bankTransfer,
                    globalBankTransferCurrencies: globalTransfer,
                    bankTransferCountries,
                    globalBankTransferCountries,
                    status: FetchStatus.Fulfilled,
                    error: null,
                });

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

        reset: () => {
            set({
                bankTransferCurrencies: [],
                globalBankTransferCurrencies: [],
                status: FetchStatus.Idle,
                error: null,
            });
        },
    })
);