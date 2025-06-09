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
    accessToken: string | null;
    authFetchStatus: FetchStatus;
}

interface Actions {
    setIsAuth: (value: boolean) => void;
    setAuthData: (data: string | null) => void;
    setAccessToken: (accessToken: string | null) => void;
    setAuthFetchStatus: (status: FetchStatus) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
    isAuth: false,
    authData: null,
    accessToken: null,
    authFetchStatus: FetchStatus.Idle,

    setIsAuth: (value: boolean) => set(() => ({ isAuth: value })),
    setAuthData: (data: string | null) => set(() => ({ authData: data })),
    setAccessToken: (accessToken) => set(() => ({ accessToken })),
    setAuthFetchStatus: (status) => set(() => ({ authFetchStatus: status })),
}));