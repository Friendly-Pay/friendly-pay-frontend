import { useCardsStore } from '../cards/store';
import { CurrencyType, useCurrency } from '../currency/hooks';
import { InitialPurchaseOrder, InitialTopupOrder } from '../user/fetch';
import { cancelPurchaseTransaction, cancelTopupTransaction, createCardPurchaseCrypto, createPurchaseCardSbp, createTopupCrypto, createTopupSbp, fetchPurchaseTransactionStatus, fetchTopupTransactionStatus, } from './fetch';
import { PaymentCurrencyRate } from './rate';
import { OrderStorage } from './storage';
import { create } from 'zustand';

export enum PaymentStatus {
    Idle = 'idle',
    Start = 'Start', // Платеж начат
    Loading = 'Loading', // Загрузка платежа
    ReadyForPayment = 'ReadyForPayment', // Готов для совершения платежа
    Waiting = 'waiting', // Ожидание платежа (отдельный экран)
    UserHiddenWaiting = 'userHiddenWaiting', // Юзер скрыл ожидание платежа
    Processing = 'processing',
    Success = 'success',
    Failed = 'failed',
}

export interface TopupOrderCrypto {
    transactionId: number
    receivedAmount: number | null
    receivedAmountFee: number | null
    address: string
    expireAt: number
}

export interface TopupOrderSbp {
    transactionId: number
    amount: number
    fee: number | null
    qrLink: string
    expireAt: number
}

export interface PurchaseOrderCrypto {
    transactionId: number
    amount: number
    address: string
    expireAt: number
}

export interface PurchaseOrderSbp {
    transactionId: number;
    amount: number;
    qrLink: string;
    expireAt: number;
}

type CurrencyModalState = 'IDLE' | 'TOPUP' | 'CARD_PURCHASE';

interface State {
    purchaseSelectedCardTypeId: number | null;
    purchaseSelectedCurrencyId: string | null;
    purchaseSelectedCurrencyRate: number;
    purchaseStatus: PaymentStatus;
    purchaseOrder: PurchaseOrderCrypto | PurchaseOrderSbp | null;
    purchaseRequestId: number;

    topupSelectedCardId: number | null;
    topupSelectedCurrencyId: string | null;
    topupSelectedCurrencyRate: number;
    topupStatus: PaymentStatus;
    topupOrder: TopupOrderCrypto | TopupOrderSbp | null;
    topupRequestId: number;

    currencyModal: { opened: boolean, modalState: CurrencyModalState };
    poolingTransactionStatus: boolean;
}

interface Actions {
    startTopup: (cardId: number) => Promise<void>;
    startCardPurchase: (cardTypeId: number) => Promise<void>;

    setTopupCurrency: (currencyId: string, currencyType: CurrencyType) => Promise<void>;
    setCardPurchaseCurrency: (currencyId: string, currencyType: CurrencyType) => Promise<void>;

    createSbpTopup: (amountRub: number) => Promise<{ paymentUrl: string } | undefined>;
    createSbpPurchase: (requestId: number) => Promise<{ paymentUrl: string } | undefined>;

    openCryptoTopupPaymentWaiting: () => void;
    openPurchasePaymentWaiting: () => void;

    hideTopupPaymentWaiting: () => void;
    hidePurchasePaymentWaiting: () => void;

    completeTopup: (transactionId: number, receivedAmount: number, receivedAmountFee: number) => void;
    completeCardPurchase: (transactionId: number) => void;

    cancelTopup: (transactionId: number) => Promise<void>;
    cancelCardPurchase: (transactionId: number) => Promise<void>;

    resetTopup: () => void;
    resetCardPurchase: () => void;

    restoreTopup: (initialOrder: InitialTopupOrder) => void;
    restoreCardPurchase: (initialOrder: InitialPurchaseOrder) => void;

    checkPurchaseTransactionStatus: (transactionId: number) => Promise<void>;
    checkTopupTransactionStatus: (transactionId: number) => Promise<void>;

    openCurrencyModal: (modalState: CurrencyModalState) => void;
    closeCurrencyModal: () => void;

    startPoolingTransactionStatus: () => void;
    stopPoolingTransactionStatus: () => void;

    reset: () => void;
}

export const usePaymentStore = create<State & Actions>((set, get) => ({
    purchaseSelectedCardTypeId: null,
    purchaseSelectedCurrencyId: null,
    purchaseSelectedCurrencyRate: 0,
    purchaseStatus: PaymentStatus.Idle,
    purchaseOrder: null,
    purchaseRequestId: 0,

    topupSelectedCardId: null,
    topupSelectedCurrencyId: null,
    topupSelectedCurrencyRate: 0,
    topupStatus: PaymentStatus.Idle,
    topupOrder: null,
    topupRequestId: 0,

    currencyModal: { opened: false, modalState: 'IDLE' },
    poolingTransactionStatus: false,

    startTopup: async (cardId) => {
        const { resetCardPurchase, resetTopup } = get();
        resetCardPurchase();
        resetTopup();
        set({
            topupSelectedCardId: cardId,
            topupStatus: PaymentStatus.Start,
        });
    },
    startCardPurchase: async (cardTypeId) => {
        const { resetCardPurchase, resetTopup } = get();
        resetCardPurchase();
        resetTopup();
        set({
            purchaseSelectedCardTypeId: cardTypeId,
            purchaseStatus: PaymentStatus.Start,
        });
    },

    /**
     * Установить валюту пополнения
     */
    setTopupCurrency: async (currencyId, currencyType) => {
        const { topupRequestId, topupSelectedCurrencyId, topupOrder: prevTopupOrder, cancelTopup } = get();
        if (topupSelectedCurrencyId === currencyId) {
            return;
        }
        if (prevTopupOrder) {
            cancelTopup(prevTopupOrder.transactionId);
        }

        const requestId = topupRequestId + 1;

        set({
            topupSelectedCurrencyId: currencyId,
            topupStatus: PaymentStatus.Loading,
            topupOrder: null,
            topupRequestId: requestId
        });

        const { topupSelectedCardId } = get();
        const cardId = topupSelectedCardId;
        if (!cardId) {
            console.warn('[setTopupCurrency] cardId undefined');
            return;
        }

        try {
            const rate = await PaymentCurrencyRate.loadRate(currencyType);
            set({ topupSelectedCurrencyRate: rate });

            if (get().topupRequestId !== requestId) {
                return;
            }

            // Для СБП только устанавливаем курс
            if (currencyType === 'RUB') {
                set({ topupStatus: PaymentStatus.ReadyForPayment });
                return;
            }

            const res = await createTopupCrypto({ cardId, currency: currencyId });

            if (get().topupRequestId !== requestId) {
                cancelTopup(res.transactionId);
                return;
            }

            set({
                topupStatus: PaymentStatus.ReadyForPayment,
                topupOrder: {
                    transactionId: res.transactionId,
                    receivedAmount: null,
                    receivedAmountFee: null,
                    address: res.address,
                    expireAt: res.expireAt
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.ReadyForPayment,
                expireAt: res.expireAt
            });
        } catch (error) {
            console.error('[setTopupCurrency]', error);
            if (get().topupRequestId === requestId) {
                set({ topupStatus: PaymentStatus.Failed });
            }
        }
    },
    /**
     * Установить валюту покупки
     */
    setCardPurchaseCurrency: async (currencyId, currencyType) => {
        const { purchaseRequestId, purchaseSelectedCurrencyId, purchaseOrder: prevPurchaseOrder, cancelCardPurchase } = get();
        if (purchaseSelectedCurrencyId === currencyId) {
            return;
        }
        if (prevPurchaseOrder) {
            cancelCardPurchase(prevPurchaseOrder.transactionId);
        }

        const requestId = purchaseRequestId + 1;
        set({
            purchaseSelectedCurrencyId: currencyId,
            purchaseStatus: PaymentStatus.Loading,
            purchaseOrder: null,
            purchaseRequestId: requestId
        });

        const cardTypeId = get().purchaseSelectedCardTypeId;
        if (!cardTypeId) {
            console.warn('[setCardPurchaseCurrency] cardTypeId undefined');
            return;
        }

        try {
            const rate = await PaymentCurrencyRate.loadRate(currencyType);
            set({ purchaseSelectedCurrencyRate: rate });

            if (get().purchaseRequestId !== requestId) {
                return;
            }

            // Для СБП сразу создаем qr
            if (currencyType === 'RUB') {
                await get().createSbpPurchase(requestId);
                return;
            }

            const res = await createCardPurchaseCrypto({ cardTypeId, currency: currencyId });

            if (get().purchaseRequestId !== requestId) {
                cancelCardPurchase(res.transactionId);
                return;
            }

            set({
                purchaseStatus: PaymentStatus.ReadyForPayment,
                purchaseOrder: {
                    transactionId: res.transactionId,
                    amount: res.amount,
                    address: res.address,
                    expireAt: res.expireAt,
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.ReadyForPayment,
                expireAt: res.expireAt
            });
        } catch (error) {
            console.error('[setCardPurchaseCurrency]', error);
            if (get().purchaseRequestId === requestId) {
                set({ purchaseStatus: PaymentStatus.Failed });
            }
        }
    },

    /**
     * Создать QR СБП для пополнения
     * */
    createSbpTopup: async (amountRub) => {
        const { topupSelectedCardId, topupRequestId, cancelTopup } = get();
        if (!topupSelectedCardId) {
            return;
        }

        // Нужен request id, потому что валюту могли сменить пока идет загрузка
        const requestId = topupRequestId + 1;
        set({ topupRequestId: requestId });

        try {
            const res = await createTopupSbp({ cardId: topupSelectedCardId, amountRub });

            if (get().topupRequestId !== requestId) {
                cancelTopup(res.transactionId);
                return;
            }

            set({
                topupStatus: PaymentStatus.Waiting,
                topupOrder: {
                    transactionId: res.transactionId,
                    amount: amountRub,
                    fee: null,
                    qrLink: res.qrLink,
                    expireAt: res.expireAt
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.Waiting,
                expireAt: res.expireAt
            });

            return { paymentUrl: res.qrLink };
        } catch (error) {
            console.error('[createSbpTopup]', error);
            set({ topupStatus: PaymentStatus.Failed });
        }
    },

    /**
     * Создать QR СБП для покупки карты
     * */
    createSbpPurchase: async (requestId) => {
        const { purchaseSelectedCardTypeId, cancelCardPurchase } = get();
        if (!purchaseSelectedCardTypeId) {
            return;
        }

        try {
            const res = await createPurchaseCardSbp({ cardTypeId: purchaseSelectedCardTypeId });

            if (get().purchaseRequestId !== requestId) {
                cancelCardPurchase(res.transactionId);
                return;
            }

            set({
                purchaseStatus: PaymentStatus.ReadyForPayment,
                purchaseOrder: {
                    transactionId: res.transactionId,
                    amount: res.amount,
                    qrLink: res.qrLink,
                    expireAt: res.expireAt
                },
            });
            OrderStorage.save(res.transactionId, {
                status: PaymentStatus.ReadyForPayment,
                expireAt: res.expireAt
            });

            return { paymentUrl: res.qrLink };
        } catch (error) {
            console.error('[createSbpTopup]', error);
            if (get().purchaseRequestId === requestId) {
                set({ topupStatus: PaymentStatus.Failed });
            }
        }
    },

    /**
     * Переводит пополнение в специальный статус ожидания оплаты.
     * Эффект только визуальный
     */
    openCryptoTopupPaymentWaiting: () => {
        const order = get().topupOrder;
        if (!order) {
            console.warn('[openCryptoTopupPaymentWaiting] topupOrder undefined');
            return;
        }
        const status = PaymentStatus.Waiting;
        set({ topupStatus: status });
        OrderStorage.update(order.transactionId, { status });
    },
    openPurchasePaymentWaiting: () => {
        const order = get().purchaseOrder;
        if (!order) {
            console.warn('[openCryptoPurchasePaymentWaiting] purchaseOrder undefined');
            return;
        }
        const status = PaymentStatus.Waiting;
        set({ purchaseStatus: status });
        OrderStorage.update(order.transactionId, { status });
    },

    /**
     * Скрыть ожидание пополнения, тогда PaymentRestore не восстановит транзакцию
     * */
    hideTopupPaymentWaiting: () => {
        const order = get().topupOrder;
        if (!order) {
            console.warn('[hideTopupPaymentWaiting] topupOrder undefined');
            return;
        }

        const status = PaymentStatus.UserHiddenWaiting;
        set({ topupStatus: status });
        OrderStorage.update(order.transactionId, { status });
    },
    hidePurchasePaymentWaiting: () => {
        const order = get().purchaseOrder;
        if (!order) {
            console.warn('[hidePurchasePaymentWaiting] purchaseOrder undefined');
            return;
        }

        const status = PaymentStatus.UserHiddenWaiting;
        set({ purchaseStatus: status });
        OrderStorage.update(order.transactionId, { status });
    },

    /** Завершить платеж по статусу транзакции от API */
    completeTopup: (transactionId, receivedAmount, receivedAmountFee) => {
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
                receivedAmountFee: receivedAmountFee
            }
        });
        OrderStorage.remove(transactionId);
        useCardsStore.getState().refetchCards();
    },
    completeCardPurchase: async (transactionId) => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) return;
        if (purchaseOrder.transactionId !== transactionId) {
            console.warn(`[completeCardPurchase] wrong order id: state ${purchaseOrder.transactionId}, socket ${transactionId}`);
            return;
        }
        await useCardsStore.getState().refetchCards();
        set({ purchaseStatus: PaymentStatus.Success });
        OrderStorage.remove(transactionId);
    },

    /** Только in-progress транзакции */
    restoreTopup: (initialOrder) => {
        const storedOrder = OrderStorage.get(initialOrder.transactionId);
        const status = storedOrder ? storedOrder.status : PaymentStatus.ReadyForPayment;

        let topupOrder: TopupOrderCrypto | TopupOrderSbp | null = null;
        if (initialOrder.qrLink) {
            topupOrder = {
                transactionId: initialOrder.transactionId,
                amount: initialOrder.amount,
                fee: null,
                qrLink: initialOrder.qrLink,
                expireAt: initialOrder.expireAt,
            } as TopupOrderSbp;
        } else if (initialOrder.address) {
            topupOrder = {
                transactionId: initialOrder.transactionId,
                receivedAmount: null, // Будет обновлено при успешном пополнении
                receivedAmountFee: null, // Будет обновлено при успешном пополнении
                address: initialOrder.address,
                expireAt: initialOrder.expireAt,
            } as TopupOrderCrypto;
        }

        if (topupOrder) {
            set({
                topupSelectedCurrencyId: initialOrder.currency,
                topupSelectedCardId: initialOrder.cardId,
                topupStatus: status,
                topupOrder,
            });
        }
    },

    /** Только in-progress транзакции */
    restoreCardPurchase: (initialOrder) => {
        const storedOrder = OrderStorage.get(initialOrder.transactionId);
        const status = storedOrder ? storedOrder.status : PaymentStatus.ReadyForPayment;

        let purchaseOrder: PurchaseOrderCrypto | PurchaseOrderSbp | null = null;

        if (initialOrder.qrLink) {
            purchaseOrder = {
                transactionId: initialOrder.transactionId,
                amount: initialOrder.amount,
                qrLink: initialOrder.qrLink,
                expireAt: initialOrder.expireAt,
            } as PurchaseOrderSbp;
        } else if (initialOrder.address) {
            purchaseOrder = {
                transactionId: initialOrder.transactionId,
                amount: initialOrder.amount,
                address: initialOrder.address,
                expireAt: initialOrder.expireAt,
            } as PurchaseOrderCrypto;
        }

        if (purchaseOrder) {
            set({
                purchaseSelectedCardTypeId: initialOrder.cardTypeId,
                purchaseSelectedCurrencyId: initialOrder.currency,
                purchaseStatus: status,
                purchaseOrder,
            });
        }
    },

    cancelTopup: async () => {
        const { topupOrder } = get();
        if (!topupOrder) {
            return;
        }
        try {
            await cancelTopupTransaction(topupOrder.transactionId);
        } catch (error) {
            console.error(error);
        }
    },
    cancelCardPurchase: async () => {
        const { purchaseOrder } = get();
        if (!purchaseOrder) {
            return;
        }
        try {
            await cancelPurchaseTransaction(purchaseOrder.transactionId);
        } catch (error) {
            console.error(error);
        }
    },

    checkPurchaseTransactionStatus: async (transactionId) => {
        const { completeCardPurchase, stopPoolingTransactionStatus } = get();
        const res = await fetchPurchaseTransactionStatus(transactionId);
        if (res.status === 'Success') {
            completeCardPurchase(transactionId);
            stopPoolingTransactionStatus();
        }
    },
    checkTopupTransactionStatus: async (transactionId) => {
        const { completeTopup, stopPoolingTransactionStatus } = get();
        const res = await fetchTopupTransactionStatus(transactionId);
        if (res.status === 'Success') {
            completeTopup(transactionId, res.amount!, res.fee!);
            stopPoolingTransactionStatus();
        }
    },

    openCurrencyModal: (modalState) => set({ currencyModal: { opened: true, modalState } }),
    closeCurrencyModal: () => set({ currencyModal: { opened: false, modalState: 'IDLE' } }),

    startPoolingTransactionStatus: () => set({ poolingTransactionStatus: true }),
    stopPoolingTransactionStatus: () => set({ poolingTransactionStatus: false }),

    resetCardPurchase: () => {
        const { purchaseOrder } = get();
        if (purchaseOrder) OrderStorage.remove(purchaseOrder.transactionId);
        set({
            purchaseSelectedCardTypeId: null,
            purchaseSelectedCurrencyId: null,
            purchaseSelectedCurrencyRate: 0,
            purchaseStatus: PaymentStatus.Idle,
            purchaseOrder: null,
            purchaseRequestId: 0,
        });
    },
    resetTopup: () => {
        const { topupOrder } = get();
        if (topupOrder) OrderStorage.remove(topupOrder.transactionId);
        set({
            topupSelectedCardId: null,
            topupSelectedCurrencyId: null,
            topupSelectedCurrencyRate: 0,
            topupStatus: PaymentStatus.Idle,
            topupOrder: null,
            topupRequestId: 0,
        });
    },

    reset: () => set({
        purchaseSelectedCardTypeId: null,
        purchaseSelectedCurrencyId: null,
        purchaseSelectedCurrencyRate: 0,
        purchaseStatus: PaymentStatus.Idle,
        purchaseOrder: null,
        purchaseRequestId: 0,

        topupSelectedCardId: null,
        topupSelectedCurrencyId: null,
        topupSelectedCurrencyRate: 0,
        topupStatus: PaymentStatus.Idle,
        topupOrder: null,
        topupRequestId: 0,

        currencyModal: { opened: false, modalState: 'IDLE' },
        poolingTransactionStatus: false,
    })
}));

export const usePaymentTopupCurrency = () => {
    const currencyId = usePaymentStore(state => state.topupSelectedCurrencyId);
    return useCurrency(currencyId);
};

export const usePaymentPurchaseCurrency = () => {
    const currencyId = usePaymentStore(state => state.purchaseSelectedCurrencyId);
    return useCurrency(currencyId);
};

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getPaymentStore = () => usePaymentStore.getState();
}