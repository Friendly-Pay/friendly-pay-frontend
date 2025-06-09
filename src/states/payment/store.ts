import { useCardsStore } from '../cards/store';
import { fetchPurchaseStatus, fetchTopupStatus, makeCardDeposit, purchaseCard } from './fetch';
import usdtTrc20 from 'assets/coins/usdt_trc20.png';
import { create } from 'zustand';

export enum PaymentStatus {
    Idle = 'idle',
    Creating = 'creating',
    Waiting = 'waiting',
    Processing = 'processing',
    Success = 'success',
    Failed = 'failed',
}

const currencies = {
    'usdt-trc20': {
        id: 'usdt-trc20',
        name: 'USDT',
        image: usdtTrc20,
        network: 'TRC20',
        approximateSeconds: 60 * 10
    }
};

export interface CurrencyItem {
    id: string;
    name: string;
    image: string;
    network: string;
    approximateSeconds: number;
};

export interface TopupOrder {
    transactionId: number
    address: string
    receivedAmount: number | null
    receivedCurrency: string | null
    expireAt: number
}

export interface PurchaseOrder {
    transactionId: number
    amount: string
    currency: string;
    address: string
    expireAt: number
}

interface State {
    currencies: Record<string, CurrencyItem>;
    purchaseSelectedCardTypeId: number | null;
    purchaseSelectedCurrencyId: string | null;
    purchaseStatus: PaymentStatus;
    purchaseOrder: PurchaseOrder | null;
    topupSelectedCurrencyId: string | null;
    topupStatus: PaymentStatus;
    topupOrder: TopupOrder | null;
    poolingTransactionStatus: boolean;
}

interface Actions {
    setTopupStatus: (status: PaymentStatus) => void;
    setPurchaseStatus: (status: PaymentStatus) => void;
    startTopup: (currencyId: string) => Promise<void>;
    startCardPurchase: (cardTypeId: number) => Promise<void>;
    completeTopup: (transactionId: number, receivedAmount: number, receivedCurrency: string) => void;
    completeCardPurchase: (transactionId: number) => void;
    resetTopup: () => void;
    resetCardPurchase: () => void;
    checkPurchaseTransactionStatus: (transactionId: number) => Promise<void>;
    checkTopupTransactionStatus: (transactionId: number) => Promise<void>;
    startPoolingTransactionStatus: () => void;
    stopPoolingTransactionStatus: () => void;
    reset: () => void;
}

export const usePaymentStore = create<State & Actions>((set, get) => ({
    currencies,
    purchaseSelectedCardTypeId: null,
    purchaseSelectedCurrencyId: null,
    purchaseStatus: PaymentStatus.Idle,
    purchaseOrder: null,
    topupSelectedCurrencyId: null,
    topupStatus: PaymentStatus.Idle,
    topupOrder: null,
    poolingTransactionStatus: false,

    setTopupStatus: (status) => set({ topupStatus: status }),
    setPurchaseStatus: (status) => set({ purchaseStatus: status }),

    startTopup: async (currencyId) => {
        get().reset();
        set({
            topupSelectedCurrencyId: currencyId,
            topupStatus: PaymentStatus.Creating,
            topupOrder: null
        });
        try {
            const selectedCardId = useCardsStore.getState().selectedCardId;
            if (!selectedCardId) throw new Error('[topup] selected card undefined');
            const res = await makeCardDeposit(selectedCardId);
            set({
                topupStatus: PaymentStatus.Waiting,
                topupOrder: {
                    transactionId: res.transactionId,
                    address: res.address,
                    receivedAmount: null,
                    receivedCurrency: null,
                    expireAt: res.expireAt
                },
            });
        } catch (error: any) {
            console.error('[loadOrder]', error);
            set({ topupStatus: PaymentStatus.Failed });
        }
    },
    startCardPurchase: async (cardTypeId) => {
        get().reset();
        set({
            purchaseSelectedCardTypeId: cardTypeId,
            purchaseSelectedCurrencyId: 'usdt-trc20',
            purchaseStatus: PaymentStatus.Creating,
            purchaseOrder: null
        });
        try {
            const res = await purchaseCard(cardTypeId);
            set({
                purchaseStatus: PaymentStatus.Waiting,
                purchaseOrder: {
                    transactionId: res.transactionId,
                    amount: res.amount,
                    currency: res.currency,
                    address: res.address,
                    expireAt: res.expireAt,
                },
            });
        } catch (error: any) {
            console.error('[startCardPurchase]', error);
            set({ purchaseStatus: PaymentStatus.Failed });
        }
    },

    // @TODO refetch transactions
    completeTopup: (transactionId, receivedAmount, receivedCurrency) => {
        const { topupOrder } = get();
        if (!topupOrder) return;
        if (topupOrder.transactionId !== transactionId) {
            console.warn(`[completeTopup] wrong order id: state ${topupOrder.transactionId}, socket ${transactionId}`);
            return;
        }
        set({
            topupStatus: PaymentStatus.Processing,
            topupOrder: {
                ...topupOrder,
                receivedAmount: receivedAmount,
                receivedCurrency: receivedCurrency
            }
        });
    },
    // @TODO refetch transactions
    completeCardPurchase: (transactionId) => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) return;
        if (purchaseOrder.transactionId !== transactionId) {
            console.warn(`[completeCardPurchase] wrong order id: state ${purchaseOrder.transactionId}, socket ${transactionId}`);
            return;
        }
        set({
            purchaseSelectedCurrencyId: null,
            purchaseStatus: PaymentStatus.Success,
        });
        useCardsStore.getState().loadMyCards();
    },

    checkPurchaseTransactionStatus: async (transactionId) => {
        const { completeCardPurchase, stopPoolingTransactionStatus } = get();
        const res = await fetchPurchaseStatus(transactionId);
        if (res.status === 'Success') {
            completeCardPurchase(transactionId);
            stopPoolingTransactionStatus();
        }
    },
    checkTopupTransactionStatus: async (transactionId) => {
        const { completeTopup, stopPoolingTransactionStatus } = get();
        const res = await fetchTopupStatus(transactionId);
        if (res.status === 'Success') {
            completeTopup(transactionId, res.amount!, res.currency!);
            stopPoolingTransactionStatus();
        }
    },

    startPoolingTransactionStatus: () => set({ poolingTransactionStatus: true }),
    stopPoolingTransactionStatus: () => set({ poolingTransactionStatus: false }),

    resetCardPurchase: () => set({
        purchaseSelectedCardTypeId: null,
        purchaseSelectedCurrencyId: null,
        purchaseStatus: PaymentStatus.Idle,
        purchaseOrder: null,
        poolingTransactionStatus: false
    }),
    resetTopup: () => set({
        topupSelectedCurrencyId: null,
        topupStatus: PaymentStatus.Idle,
        topupOrder: null,
        poolingTransactionStatus: false
    }),
    reset: () => set({
        purchaseSelectedCardTypeId: null,
        purchaseSelectedCurrencyId: null,
        purchaseStatus: PaymentStatus.Idle,
        purchaseOrder: null,
        topupSelectedCurrencyId: null,
        topupStatus: PaymentStatus.Idle,
        topupOrder: null,
    })
}));

export const usePaymentTopupCurrency = () => {
    const currencies = usePaymentStore(state => state.currencies);
    const currentCurrencyId = usePaymentStore(state => state.topupSelectedCurrencyId);
    return currentCurrencyId ? currencies[currentCurrencyId] : null;
};

export const usePaymentPurchaseCurrency = () => {
    const currencies = usePaymentStore(state => state.currencies);
    const currentCurrencyId = usePaymentStore(state => state.purchaseSelectedCurrencyId);
    return currentCurrencyId ? currencies[currentCurrencyId] : null;
};

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getPaymentStore = () => usePaymentStore.getState();
}