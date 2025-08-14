import {
    fetchReferralInfo,
    withdrawReferralFunds,
} from './fetch';
import { FetchStatus } from '@/utils/api';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum BonusTransactionType {
    PurchaseCard = 'PurchaseCard',
    DepositCard = 'DepositCard',
    Withdrawal = 'Withdrawal'
}

export interface BonusTransaction {
    id: number;
    type: BonusTransactionType;
    amount: number;
    cardTypeId: number | null;
    createdAt: number;
}

export enum BonusTransferStatus {
    Idle = 'idle',
    Loading = 'loading',
    Success = 'success',
    Failed = 'failed'
}

interface State {
    referralId: string | null;
    balance: number | null;
    balanceCurrency: 'USD';
    transactions: BonusTransaction[] | null;
    fetchStatus: FetchStatus;
    transferAmount: number | null;
    transferMinAmount: number | null;
    transferSelectedCardId: number | null;
    transferCardSelectOpened: boolean;
}

interface Actions {
    load: () => Promise<void>;
    setTransferCardId: (cardId: number) => void;
    setTransferAmount: (amount: number) => void;
    openTransferCardSelect: (cardId?: number) => void;
    closeTransferCardSelect: () => void;
    withdraw: (params: { cardId: number; amount: number }) => Promise<void>;
    resetWithdraw: () => void;
}

export const useFriendsBonusesStore = create<State & Actions>((set, get) => ({
    referralId: null,
    balance: null,
    balanceCurrency: 'USD',
    transactions: null,
    fetchStatus: FetchStatus.Idle,
    transferAmount: null,
    transferMinAmount: null,
    transferSelectedCardId: null,
    transferCardSelectOpened: false,

    load: async () => {
        set({ fetchStatus: FetchStatus.Pending });
        try {
            const data = await fetchReferralInfo();
            set({
                referralId: data.referralId,
                balance: data.balance,
                transactions: data.transactions as BonusTransaction[],
                transferMinAmount: data.minWithdrawAmount,
                fetchStatus: FetchStatus.Fulfilled,
            });
        } catch (error: any) {
            console.error('[friends] loadFriendsData error:', error);
            set({ fetchStatus: FetchStatus.Rejected });
            toast.error(`Error: ${error.message}`);
        }
    },

    setTransferCardId: (cardId) => {
        set({ transferSelectedCardId: cardId });
    },
    setTransferAmount: (amount) => {
        set({ transferAmount: amount });
    },

    openTransferCardSelect: () => {
        set({ transferCardSelectOpened: true });
    },
    closeTransferCardSelect: () => {
        set({ transferCardSelectOpened: false });
    },

    withdraw: async ({ cardId, amount }) => {
        await withdrawReferralFunds(cardId, amount);
        await get().load();
    },

    resetWithdraw: () => {
        set({
            transferAmount: null,
            transferSelectedCardId: null
        });
    }
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getFriendsStore = () => useFriendsStore.getState();
}