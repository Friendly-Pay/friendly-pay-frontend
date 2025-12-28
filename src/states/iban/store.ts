import { activateIbanAccount, fetchIbanAccountStatus, fetchIbanTransactions } from './fetch';
import { FetchStatus } from '@/utils/api';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum IbanStatus {
    Idle = 'Idle',
    InProgress = 'InProgress',
    Activated = 'Success',
    Failed = 'Failed'
}

interface IbanAccount {
    status: IbanStatus;
    balance: number | null;
    currency: string | null;
    balanceOnHold: number | null;
    balanceFrozen: number | null;
    bankName: string | null;
    bankAddress: string | null;
    iban: string | null;
    swift: string | null;
    recipient: string | null;
    available: boolean;
}

export enum IbanTransactionType {
    DEPOSIT = 'DEPOSIT',
    PAYMENT = 'PAYMENT'
}

export enum IbanTransactionStatus {
    NEW = 'NEW',
    PENDING = 'PENDING',
    PENDING_EXTERNALLY = 'PENDING_EXTERNALLY',
    PENDING_FX = 'PENDING_FX',
    APPROVAL = 'APPROVAL',
    EMAIL_APPROVAL = 'EMAIL_APPROVAL',
    LEGAL_APPROVAL = 'LEGAL_APPROVAL',
    LEGAL_APPROVED = 'LEGAL_APPROVED',
    APPROVED = 'APPROVED',
    APPROVED_BY_RISK_MANAGER = 'APPROVED_BY_RISK_MANAGER',
    APPROVED_BY_COMPLIANCE_MANAGER = 'APPROVED_BY_COMPLIANCE_MANAGER',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
    ERROR = 'ERROR',
    FAILED = 'FAILED',
    REVERTED = 'REVERTED'
}

export interface IbanTransaction {
    id: number;
    type: IbanTransactionType;
    status: IbanTransactionStatus;
    amount: number;
    currency: string;
    original_amount: number;
    original_currency: string;
    senderName: string;
    receiverName: string;
    details: string;
    createdAt: number;
}

interface State {
    account: IbanAccount | null;
    accountFetchStatus: FetchStatus;
    transactions: IbanTransaction[];
    transactionsFetchStatus: FetchStatus;
    ibanAccountDetailsOpened: boolean;
    transferModalOpened: boolean;
}

interface Actions {
    loadAccount: () => Promise<IbanAccount | undefined>;
    loadTransactions: (params: { limit: number; offset: number }) => Promise<IbanTransaction[] | undefined>;
    activateIbanAccount: () => Promise<void>;
    openIbanAccountDetails: () => void;
    closeIbanAccountDetails: () => void;
    openTransferModal: () => void;
    closeTransferModal: () => void;
}

export const useIbanStore = create<State & Actions>((set, get) => ({
    account: null,
    accountFetchStatus: FetchStatus.Idle,
    transactions: [],
    transactionsFetchStatus: FetchStatus.Idle,
    ibanAccountDetailsOpened: false,
    transferModalOpened: false,

    loadAccount: async () => {
        set({ accountFetchStatus: FetchStatus.Pending });
        try {
            const res = await fetchIbanAccountStatus();
            const account: IbanAccount = {
                ...res,
                status: res.status as IbanStatus
            };
            set({
                account,
                accountFetchStatus: FetchStatus.Fulfilled,
            });
            return account;
        } catch (error: any) {
            console.error('[fetchBankAccount]', error);
            toast.error(error.message);
            set({ accountFetchStatus: FetchStatus.Rejected });
        }
    },

    loadTransactions: async (params) => {
        set({ transactionsFetchStatus: FetchStatus.Pending });
        try {
            const res = await fetchIbanTransactions(params);
            const transactions = res as IbanTransaction[];

            set({
                transactions,
                transactionsFetchStatus: FetchStatus.Fulfilled,
            });
            return transactions;
        } catch (error: any) {
            console.error('[fetchIbanTransactions]', error);
            toast.error(error.message);
            set({ transactionsFetchStatus: FetchStatus.Rejected });
        }
    },

    activateIbanAccount: async () => {
        try {
            await activateIbanAccount();
            await get().loadAccount();
        } catch (error) {
            console.error('[fetchIbanTransactions]', error);
            toast.error('Failed to open IBAN account');
        }
    },

    openIbanAccountDetails: () => set({ ibanAccountDetailsOpened: true }),
    closeIbanAccountDetails: () => set({ ibanAccountDetailsOpened: false }),

    openTransferModal: () => set({ transferModalOpened: true }),
    closeTransferModal: () => set({ transferModalOpened: false }),
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getIbanStore = () => useIbanStore.getState();
}