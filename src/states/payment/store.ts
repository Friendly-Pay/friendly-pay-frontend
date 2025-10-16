import { useCardsStore } from '../cards/store';
import { InitialPurchaseOrder, InitialTopupOrder } from '../user/fetch';
import { cancelTopup, fetchPurchaseStatus, fetchTopupStatus, makeCardDeposit, purchaseCard } from './fetch';
import { OrderStorage } from './storage';
import usdtBep from 'assets/coins/usdt-bep.png?inline';
import usdtTrc from 'assets/coins/usdt-trc.png?inline';
import { create } from 'zustand';

export enum PaymentStatus {
    Idle = 'idle',
    Creating = 'creating',
    Waiting = 'waiting',
    UserCompleteWaiting = 'userCompleteWaiting',
    UserHiddenWaiting = 'userHiddenWaiting',
    Processing = 'processing',
    Success = 'success',
    Failed = 'failed',
    Cancel = 'cancel'
}

const currencies = {
    'USDTTRC': {
        id: 'USDTTRC',
        name: 'USDT',
        image: usdtTrc,
        network: 'TRC20'
    },
    'USDTBSC': {
        id: 'USDTBSC',
        name: 'USDT',
        image: usdtBep,
        network: 'BEP20'
    },
} as const;

export interface CurrencyItem {
    id: string;
    name: string;
    image: string;
    network: string;
};

export interface TopupOrder {
    transactionId: number
    receivedAmount: number | null
    address: string
    expireAt: number
}

export interface PurchaseOrder {
    transactionId: number
    amount: number
    address: string
    expireAt: number
}

interface State {
    currencies: Record<string, CurrencyItem>;
    purchaseSelectedCardTypeId: number | null;
    purchaseSelectedCurrencyId: string | null;
    purchaseStatus: PaymentStatus;
    purchaseOrder: PurchaseOrder | null;
    topupSelectedCardId: number | null;
    topupSelectedCurrencyId: string | null;
    topupStatus: PaymentStatus;
    topupOrder: TopupOrder | null;
    poolingTransactionStatus: boolean;
}

interface Actions {
    startTopup: (cardId: number, currency: string) => Promise<void>;
    startCardPurchase: (cardTypeId: number, currency: string) => Promise<void>;
    completeTopup: (transactionId: number, receivedAmount: number) => void;
    completeCardPurchase: (transactionId: number) => void;
    userCompleteWaitingTopup: () => void;
    userCompleteWaitingCardPurchase: () => void;
    userHiddenWaitingTopup: () => void;
    userHiddenWaitingCardPurchase: () => void;
    cancelTopup: () => Promise<void>;
    cancelCardPurchase: () => Promise<void>;
    resetTopup: () => void;
    resetCardPurchase: () => void;
    restoreTopup: (initialOrder: InitialTopupOrder) => void;
    restoreCardPurchase: (initialOrder: InitialPurchaseOrder) => void;
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
    topupSelectedCardId: null,
    topupSelectedCurrencyId: null,
    topupStatus: PaymentStatus.Idle,
    topupOrder: null,
    poolingTransactionStatus: false,

    startTopup: async (cardId, currency) => {
        get().reset();
        set({
            topupSelectedCardId: cardId,
            topupSelectedCurrencyId: currency,
            topupStatus: PaymentStatus.Creating,
            topupOrder: null
        });
        try {
            const res = await makeCardDeposit({ cardId, currency });
            set({
                topupStatus: PaymentStatus.Waiting,
                topupOrder: {
                    transactionId: res.transactionId,
                    receivedAmount: null,
                    address: res.address,
                    expireAt: res.expireAt
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.Waiting,
                expireAt: res.expireAt
            });
        } catch (error: any) {
            console.error('[loadOrder]', error);
            set({ topupStatus: PaymentStatus.Failed });
        }
    },
    startCardPurchase: async (cardTypeId, currency) => {
        get().reset();
        set({
            purchaseSelectedCardTypeId: cardTypeId,
            purchaseSelectedCurrencyId: currency,
            purchaseStatus: PaymentStatus.Creating,
            purchaseOrder: null
        });
        try {
            const res = await purchaseCard({ cardTypeId, currency });
            set({
                purchaseStatus: PaymentStatus.Waiting,
                purchaseOrder: {
                    transactionId: res.transactionId,
                    amount: res.amount,
                    address: res.address,
                    expireAt: res.expireAt,
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.Waiting,
                expireAt: res.expireAt
            });
        } catch (error: any) {
            console.error('[startCardPurchase]', error);
            set({ purchaseStatus: PaymentStatus.Failed });
        }
    },

    // @TODO refetch transactions
    completeTopup: (transactionId, receivedAmount) => {
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
                receivedAmount: receivedAmount
            }
        });
        OrderStorage.remove(transactionId);
    },
    // @TODO refetch transactions
    completeCardPurchase: (transactionId) => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) return;
        if (purchaseOrder.transactionId !== transactionId) {
            console.warn(`[completeCardPurchase] wrong order id: state ${purchaseOrder.transactionId}, socket ${transactionId}`);
            return;
        }
        set({ purchaseStatus: PaymentStatus.Success });
        OrderStorage.remove(transactionId);
        useCardsStore.getState().loadMyCards();
    },

    // Пользователь нажимает на кнопку "Готово"
    userCompleteWaitingTopup: () => {
        const { topupOrder } = get();
        if (!topupOrder) {
            console.warn('[userCompleteWaitingTopup] topupOrder undefined');
            return;
        }
        const status = PaymentStatus.UserCompleteWaiting;
        set({ topupStatus: status });
        OrderStorage.update(topupOrder.transactionId, { status });
    },
    userCompleteWaitingCardPurchase: () => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) {
            console.warn('[userCompleteWaitingCardPurchase] purchaseOrder undefined');
            return;
        }
        const status = PaymentStatus.UserCompleteWaiting;
        set({ purchaseStatus: status });
        OrderStorage.update(purchaseOrder.transactionId, { status });
    },

    // Пользователь скрывает ожидания пополнения (поиск транзакции)
    userHiddenWaitingTopup: () => {
        const { topupOrder } = get();
        if (!topupOrder) {
            console.warn('[userHiddenWaitingTopup] topupOrder undefined');
            return;
        }
        const status = PaymentStatus.UserHiddenWaiting;
        set({ topupStatus: status });
        OrderStorage.update(topupOrder.transactionId, { status });
    },
    userHiddenWaitingCardPurchase: () => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) {
            console.warn('[userHiddenWaitingCardPurchase] purchaseOrder undefined');
            return;
        }
        const status = PaymentStatus.UserHiddenWaiting;
        set({ purchaseStatus: status });
        OrderStorage.update(purchaseOrder.transactionId, { status });
    },

    // @TODO запрашивать статус транзакции (так как можем пропустить веб сокеты)
    /** Только in-progress транзакции */
    restoreTopup: (initialOrder) => {
        const storedOrder = OrderStorage.get(initialOrder.transactionId);
        const status = storedOrder ? storedOrder.status : PaymentStatus.Waiting;
        set({
            topupSelectedCurrencyId: initialOrder.currency,
            topupSelectedCardId: initialOrder.cardId,
            topupStatus: status,
            topupOrder: {
                transactionId: initialOrder.transactionId,
                address: initialOrder.address,
                expireAt: initialOrder.expireAt,
                receivedAmount: null,
            }
        });
    },
    // @TODO запрашивать статус транзакции (так как можем пропустить веб сокеты)
    /** Только in-progress транзакции */
    restoreCardPurchase: (initialOrder) => {
        const storedOrder = OrderStorage.get(initialOrder.transactionId);
        const status = storedOrder ? storedOrder.status : PaymentStatus.Waiting;
        set({
            purchaseSelectedCardTypeId: initialOrder.cardTypeId,
            purchaseSelectedCurrencyId: initialOrder.currency,
            purchaseStatus: status,
            purchaseOrder: {
                transactionId: initialOrder.transactionId,
                amount: initialOrder.amount,
                address: initialOrder.address,
                expireAt: initialOrder.expireAt,
            },
        });
    },

    cancelTopup: async () => {
        const { topupOrder, resetTopup } = get();
        if (!topupOrder) {
            console.warn('[cancelTopup] topupOrder undefined');
            return;
        }
        try {
            resetTopup();
            await cancelTopup(topupOrder.transactionId);
        } catch (error) {
            console.error(error);
        }

    },
    cancelCardPurchase: async () => {
        const { purchaseOrder, resetCardPurchase } = get();
        if (!purchaseOrder) {
            console.warn('[cancelCardPurchase] purchaseOrder undefined');
            return;
        }
        try {
            resetCardPurchase();
            await cancelTopup(purchaseOrder.transactionId);
        } catch (error) {
            console.error(error);
        }
    },

    resetCardPurchase: () => {
        const transactionId = get().purchaseOrder?.transactionId;
        if (transactionId) OrderStorage.remove(transactionId);
        set({
            purchaseSelectedCardTypeId: null,
            purchaseSelectedCurrencyId: null,
            purchaseStatus: PaymentStatus.Idle,
            purchaseOrder: null,
            poolingTransactionStatus: false
        });
    },
    resetTopup: () => {
        const transactionId = get().topupOrder?.transactionId;
        if (transactionId) OrderStorage.remove(transactionId);
        set({
            topupSelectedCardId: null,
            topupSelectedCurrencyId: null,
            topupStatus: PaymentStatus.Idle,
            topupOrder: null,
            poolingTransactionStatus: false
        });
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
            completeTopup(transactionId, res.amount!);
            stopPoolingTransactionStatus();
        }
    },

    startPoolingTransactionStatus: () => set({ poolingTransactionStatus: true }),
    stopPoolingTransactionStatus: () => set({ poolingTransactionStatus: false }),

    reset: () => set({
        purchaseSelectedCardTypeId: null,
        purchaseSelectedCurrencyId: null,
        purchaseStatus: PaymentStatus.Idle,
        purchaseOrder: null,
        topupSelectedCurrencyId: null,
        topupStatus: PaymentStatus.Idle,
        topupOrder: null,
        poolingTransactionStatus: false
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