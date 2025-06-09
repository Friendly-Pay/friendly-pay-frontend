import { fetchUser, UserRes } from './fetch';
import { initLocalization } from '@/localization';
import { safeLanguageCode } from '@/localization/utils';
import { FetchStatus } from '@/utils/api';
import { CloudStorage, isCloudStorageAvailable } from '@/utils/storage';
import { create } from 'zustand';

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: string | null;
    status: 'Active' | 'Blocked';
    verificationLevel: 'None' | 'Base';
}

interface State {
    user: User | null;
    skipIntro: boolean;
    languageCode: string;
    userFetchStatus: FetchStatus;
}

interface Actions {
    setUser: (user: User) => void;
    setSkipIntro: (skip: boolean) => void;
    setUserFetchStatus: (status: FetchStatus) => void;
    setLanguageCode: (lang: string) => void;
    refetchUser: () => Promise<UserRes>;
}

const initIntro = () => {
    if (isCloudStorageAvailable()) {
        CloudStorage.get('skipIntro', (_, value) => {
            useUserStore.getState().setSkipIntro(value === 'true');
        });
        return false;
    }
    return localStorage.getItem('skipIntro') === 'true';
};

export const useUserStore = create<State & Actions>((set) => ({
    user: null,
    skipIntro: initIntro(),
    languageCode: initLocalization(),
    userFetchStatus: FetchStatus.Idle,

    setUser: (user) => set({ user }),
    setSkipIntro: (skip) => set({ skipIntro: skip }),
    setLanguageCode: (languageCode) => set({ languageCode: safeLanguageCode(languageCode) }),
    setUserFetchStatus: (userFetchStatus) => set({ userFetchStatus }),

    refetchUser: async () => {
        const userData = await fetchUser();
        set((state) => {
            if (!state.user) {
                console.warn('[refetchUser] user undefined');
                return {};
            }
            return {
                user: {
                    ...state.user
                }
            };
        });
        return userData;
    },
}));


if (import.meta.env.DEV) {
    // @ts-ignore
    window.getUserStore = () => useUserStore.getState();
}