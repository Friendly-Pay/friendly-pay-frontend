import { ReferralStorage } from './storage';
import { create } from 'zustand';

enum FetchStatus {
    Idle = 'idle',
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

interface State {
    isAuth: boolean;
    authData: string | null;
    referralId: string | null;
    accessToken: string | null;
    authFetchStatus: FetchStatus;
}

interface Actions {
    setIsAuth: (value: boolean) => void;
    setAuthData: (data: string | null) => void;
    setReferralId: (id: string) => void;
    setAccessToken: (accessToken: string | null) => void;
    setAuthFetchStatus: (status: FetchStatus) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
    isAuth: false,
    authData: null,
    referralId: ReferralStorage.get(),
    accessToken: null,
    authFetchStatus: FetchStatus.Idle,

    setIsAuth: (value) => set(() => ({ isAuth: value })),
    setAuthData: (data) => set(() => ({ authData: data })),
    setReferralId: (id) => {
        ReferralStorage.set(id);
        set({ referralId: id });
    },
    setAccessToken: (accessToken) => set(() => ({ accessToken })),
    setAuthFetchStatus: (status) => set(() => ({ authFetchStatus: status })),
}));