import { useUserStore, VerificationStatus } from '../user/store';
import { fetchSumsubLink } from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface State {
    sumsubLink: string;
    sumsubLinkFetchStatus: FetchStatus;
    serverError: string | null;
    selectedCardTypeId: number | null;
}

interface Actions {
    loadSumsubLink: (cardTypeId: number | null) => Promise<void>;
    setSelectedCardTypeId: (cardTypeId: number | null) => void;
    clearSumsubLink: () => void;
    clearError: () => void;
}

/**
 * Функция для проверки статуса верификации
 */
export const isSumsubNotCompleted = () => {
    const user = useUserStore.getState().user!;
    return !user.phoneNumber || user.verificationStatus !== VerificationStatus.Success;
};

export const useSumsubStore = create<State & Actions>((set, get) => ({
    sumsubLink: '',
    sumsubLinkFetchStatus: FetchStatus.Idle,
    serverError: null,
    selectedCardTypeId: null,

    setSelectedCardTypeId: (cardTypeId) => {
        set({ selectedCardTypeId: cardTypeId });
    },

    loadSumsubLink: async (cardTypeId: number | null) => {
        const { sumsubLinkFetchStatus } = get();

        // Если уже загружаем, не делаем повторный запрос
        if (sumsubLinkFetchStatus === FetchStatus.Pending) {
            return;
        }

        set({
            sumsubLinkFetchStatus: FetchStatus.Pending,
            serverError: null,
            selectedCardTypeId: cardTypeId
        });

        try {
            const verificationLink = await fetchSumsubLink(cardTypeId);
            set({
                sumsubLink: verificationLink,
                sumsubLinkFetchStatus: FetchStatus.Fulfilled,
                serverError: null
            });
        } catch (error: any) {
            console.error('Failed to load Sumsub link:', error);
            const errorMessage = 'Failed to load verification link';
            set({
                sumsubLinkFetchStatus: FetchStatus.Rejected,
                serverError: errorMessage,
                sumsubLink: ''
            });
        }
    },

    clearSumsubLink: () => {
        set({
            sumsubLink: '',
            sumsubLinkFetchStatus: FetchStatus.Idle
        });
    },

    clearError: () => {
        set({ serverError: null });
    },
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getSumsubStore = () => useSumsubStore.getState();
}