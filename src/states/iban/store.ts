import { fetchIbanAccountStatus } from './fetch';
import { FetchStatus } from '@/utils/api';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum IbanVerificationStatus {
    Idle = 'Idle',
    InProgress = 'InProgress',
    NeedAction = 'NeedAction',
    Success = 'Success',
    Failed = 'Failed'
}

export enum IbanStatus {
    Idle = 'Idle',
    InProgress = 'InProgress',
    Activated = 'Activated',
    Failed = 'Failed'
}

interface BankAccount {
    recipient: string;
    status: IbanStatus;
    verificationStatus: IbanVerificationStatus;
    balance: number;
    currency: string;
    balanceOnHold: number;
    balanceFrozen: number;
    bankName: string;
    bankAddress: string;
    iban: string;
    swift: string;
    // recipient: string | null;
    // status: IbanStatus;
    // verificationStatus: IbanVerificationStatus;
    // balance: number | null;
    // currency: string | null;
    // balanceOnHold: number | null;
    // balanceFrozen: number | null;
    // bankName: string | null;
    // bankAddress: string | null;
    // iban: string | null;
    // swift: string | null;
}

interface State {
    account: BankAccount | null;
    accountFetchStatus: FetchStatus;
    ibanAccountDetailsOpened: boolean;
    transferModalOpened: boolean;
}

interface Actions {
    loadAccount: () => Promise<BankAccount | undefined>;
    openIbanAccountDetails: () => void;
    closeIbanAccountDetails: () => void;
    openTransferModal: () => void;
    closeTransferModal: () => void;
}

export const useIbanStore = create<State & Actions>((set) => ({
    account: null,
    accountFetchStatus: FetchStatus.Idle,
    ibanAccountDetailsOpened: false,
    transferModalOpened: false,

    loadAccount: async () => {
        set({ accountFetchStatus: FetchStatus.Pending });
        try {
            const res = await fetchIbanAccountStatus();
            const account: BankAccount = {
                ...res,
                status: res.status as IbanStatus,
                verificationStatus: res.verificationStatus as IbanVerificationStatus,
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

    openIbanAccountDetails: () => set({ ibanAccountDetailsOpened: true }),
    closeIbanAccountDetails: () => set({ ibanAccountDetailsOpened: false }),

    openTransferModal: () => set({ transferModalOpened: true }),
    closeTransferModal: () => set({ transferModalOpened: false }),
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getIbanStore = () => useIbanStore.getState();
}