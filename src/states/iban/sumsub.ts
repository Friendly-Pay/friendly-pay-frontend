import { fetchSumsubToken } from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface State {
    sumsubToken: string | null;
    sumsubTokenFetchStatus: FetchStatus;
    sumsubReady: boolean;
}

interface Actions {
    generateToken: () => Promise<string>;
    setReady: (ready: boolean) => void;
    reset: () => void;
}

// @TODO вынести в отдельный стейт (sumsub будет также и для карт)
export const useSumsubStore = create<State & Actions>((set) => ({
    sumsubReady: false,
    sumsubToken: null,
    sumsubTokenFetchStatus: FetchStatus.Idle,

    generateToken: async () => {
        const res = await fetchSumsubToken();
        set({
            sumsubToken: res.token,
            sumsubTokenFetchStatus: FetchStatus.Fulfilled
        });
        return res.token;
    },

    setReady: (ready) => set({ sumsubReady: ready }),

    reset: () => {
        set({
            sumsubReady: false,
            sumsubToken: null,
            sumsubTokenFetchStatus: FetchStatus.Idle
        });
    },
}));