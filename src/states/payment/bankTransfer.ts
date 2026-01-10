import { PaymentStatus } from './store';
import { createBankTransferTransaction, CreateTransactionPayload, fetchBankTransferTransactionStatus } from '@/views/BankTransfer/state/fetch';
import { create } from 'zustand';

interface Order {
    transactionId: number;
    sourceAmount: number;
    walletAddress: string;
}

interface State {
    order: Order | null;
    paymentStatus: PaymentStatus;
    poolingTransactionStatus: boolean;
}

interface Actions {
    startPayment: (data: CreateTransactionPayload) => Promise<void>;
    completePayment: (transactionId: number) => void;
    userCompleteWaitingPayment: () => void;
    resetPayment: () => void;
    checkPaymentTransactionStatus: (transactionId: number) => Promise<void>;
    startPoolingTransactionStatus: () => void;
    stopPoolingTransactionStatus: () => void;
}

export const useBankTransferPaymentStore = create<State & Actions>((set, get) => ({
    order: null,
    paymentStatus: PaymentStatus.Idle,
    poolingTransactionStatus: false,

    startPayment: async (data) => {
        get().resetPayment();
        set({ paymentStatus: PaymentStatus.Loading });
        try {
            const res = await createBankTransferTransaction(data);
            set({
                order: res,
                paymentStatus: PaymentStatus.Waiting,
            });
        } catch (error) {
            console.error('[bank-transfer] startPayment error:', error);
            set({ paymentStatus: PaymentStatus.Failed });
        }
    },

    completePayment: (transactionId) => {
        const currentId = get().order?.transactionId;
        if (!currentId) return;
        if (currentId !== transactionId) {
            console.warn(`[bank-transfer] completePayment wrong id: state ${currentId}, payload ${transactionId}`);
            return;
        }
        set({ paymentStatus: PaymentStatus.Success });
    },

    userCompleteWaitingPayment: () => {
        const currentId = get().order?.transactionId;
        if (!currentId) {
            console.warn('[bank-transfer] userCompleteWaitingPayment: order undefined');
            return;
        }
        const status = PaymentStatus.Waiting;
        set({ paymentStatus: status });
    },

    resetPayment: () => {
        set({
            order: null,
            paymentStatus: PaymentStatus.Idle,
            poolingTransactionStatus: false,
        });
    },

    checkPaymentTransactionStatus: async (transactionId) => {
        const { completePayment, stopPoolingTransactionStatus } = get();
        try {
            const res = await fetchBankTransferTransactionStatus(transactionId);
            if (res.status === 'Success') {
                completePayment(transactionId);
                stopPoolingTransactionStatus();
            } else if (res.status === 'InProgress') {
                set({ paymentStatus: PaymentStatus.Processing });
                stopPoolingTransactionStatus();
            }
        } catch (error) {
            console.error('[bank-transfer] checkPaymentTransactionStatus error:', error);
        }
    },

    startPoolingTransactionStatus: () => set({ poolingTransactionStatus: true }),
    stopPoolingTransactionStatus: () => set({ poolingTransactionStatus: false }),
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getBankTransferPaymentStore = () => useBankTransferPaymentStore.getState();
}

