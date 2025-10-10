import { startSepaTransfer } from './fetch';
import { useIbanStore } from './store';
import { FetchStatus } from '@/utils/api';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum IbanTransferType {
    SEPA = 'sepa',
    SWIFT = 'swift'
}

export enum TransferRecipientType {
    Private = 'Private',
    Business = 'Business'
}

interface TransferData {
    amount: string;
    iban: string;
    recipient: string;
    recipientType: TransferRecipientType;
    details: string;
}

interface State {
    transfer: TransferData;
    transferType: IbanTransferType;
    transferFetchStatus: FetchStatus;
    recipientModalOpened: boolean;
}

interface Actions {
    setTransfer: (data: Partial<TransferData>) => void;
    setTransferType: (type: IbanTransferType) => void;
    sepaTransfer: (payload: TransferData) => Promise<void>;
    openRecipientModal: () => void;
    closeRecipientModal: () => void;
    reset: () => void;
}

export const useIbanTransferStore = create<State & Actions>((set) => ({
    transfer: {
        amount: '',
        iban: '',
        recipient: '',
        recipientType: TransferRecipientType.Private,
        details: ''
    },
    transferType: IbanTransferType.SEPA,
    transferFetchStatus: FetchStatus.Idle,
    recipientModalOpened: false,

    setTransfer: (data: Partial<TransferData>) => {
        set((state) => ({
            transfer: { ...state.transfer, ...data }
        }));
    },

    setTransferType: (type: IbanTransferType) => {
        set({ transferType: type });
    },

    sepaTransfer: async (payload: TransferData) => {
        set({
            transfer: payload,
            transferFetchStatus: FetchStatus.Pending
        });
        try {
            await startSepaTransfer({
                iban: payload.iban,
                amount: payload.amount,
                recipientType: payload.recipientType,
                recipientName: payload.recipient,
                details: payload.details
            });
            set({
                transfer: payload,
                transferFetchStatus: FetchStatus.Fulfilled
            });
            await useIbanStore.getState().loadAccount();
        } catch (error: any) {
            console.error('[sepaTransfer]', error);
            toast.error(error.message);
            set({ transferFetchStatus: FetchStatus.Rejected });
        }
    },

    openRecipientModal: () => set({ recipientModalOpened: true }),
    closeRecipientModal: () => set({ recipientModalOpened: false }),

    reset: () => {
        set({
            transfer: {
                amount: '',
                iban: '',
                recipient: '',
                recipientType: TransferRecipientType.Business,
                details: ''
            },
            transferType: IbanTransferType.SEPA,
            transferFetchStatus: FetchStatus.Idle,
            recipientModalOpened: false
        });
    }
}));