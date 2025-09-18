import { useBankTransferCurrenciesStore } from './currencies';
import { fetchBankTransferTransactions } from './fetch';
import { BankTransferCurrency, BankTransferMethod, BankTransferTransaction } from './types';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

export enum CalculatorField {
    Input = 'input',
    Output = 'output'
}

interface CalculatorState {
    field: CalculatorField;
    typedValue: string;
}

interface State {
    selectedCountry: string | null;
    selectedCurrency: BankTransferCurrency | null;
    selectedMethod: BankTransferMethod | null;
    selectedBankId: string | null;
    payoutAmount: string;
    transactions: BankTransferTransaction[];
    transactionsStatus: FetchStatus;
    calculator: CalculatorState;
}


interface Actions {
    setCountry: (country: string) => void;
    setCurrency: (currency: BankTransferCurrency) => void;
    setMethod: (method: BankTransferMethod) => void;
    setBankId: (bankId: string) => void;
    setPayoutAmount: (amount: string) => void;
    setCalculator: (fieldType: CalculatorField, value: string) => void;
    loadTransactions: () => Promise<void>;
    reset: () => void;
}

export const useBankTransferStore = create<State & Actions>()((set, get) => ({
    // Initial state
    selectedCountry: null,
    selectedCurrency: null,
    selectedMethod: null,
    selectedBankId: null,
    transactions: [],
    transactionsStatus: FetchStatus.Idle,
    payoutAmount: '',
    calculator: {
        field: CalculatorField.Input,
        typedValue: ''
    },

    setCountry: (country) => {
        const { selectedMethod } = get();
        set({ selectedCountry: country });

        const { bankTransferCurrencies, globalBankTransferCurrencies } = useBankTransferCurrenciesStore.getState();
        let currencies: BankTransferCurrency[] | null = null;
        if (selectedMethod === BankTransferMethod.BankTransfer) {
            currencies = bankTransferCurrencies;
        } else if (selectedMethod === BankTransferMethod.GlobalBankTransfer) {
            currencies = globalBankTransferCurrencies;
        }

        if (currencies && selectedMethod) {
            const availableCurrencies = currencies.filter(c => c.country === country && c.method === selectedMethod);
            set({ selectedCurrency: availableCurrencies[0] });
        } else {
            set({ selectedCurrency: null });
        }
    },

    setCurrency: (currency) => {
        set({
            selectedCurrency: currency,
            selectedCountry: currency.country // Устанавливаем страну из выбранной валюты
        });
    },
    setMethod: (method) => {
        set({
            selectedMethod: method,
            selectedBankId: null,
            selectedCountry: null,
            selectedCurrency: null,
        });
    },
    setBankId: (bankId) => {
        set({ selectedBankId: bankId });
    },
    setCalculator: (field, value) => {
        set({
            calculator: {
                field,
                typedValue: value
            }
        });
    },
    setPayoutAmount: (amount) => {
        set({ payoutAmount: amount });
    },

    loadTransactions: async () => {
        set({ transactionsStatus: FetchStatus.Pending });
        try {
            const transactions = await fetchBankTransferTransactions();
            set({
                transactions,
                transactionsStatus: FetchStatus.Fulfilled
            });
        } catch (error) {
            console.error(error);
            set({ transactionsStatus: FetchStatus.Rejected });
        }
    },

    reset: () => {
        set({
            selectedCountry: null,
            selectedCurrency: null,
            selectedMethod: null,
            selectedBankId: null,
            // transactions: [],
            // transactionsStatus: FetchStatus.Idle,
            payoutAmount: '',
            calculator: {
                field: CalculatorField.Input,
                typedValue: '',
            },
        });
    },
}));