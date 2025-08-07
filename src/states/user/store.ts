import { fetchUser, InitialPurchaseOrder, InitialTopupOrder, UserRes } from './fetch';
import { initLocalization } from '@/localization';
import { safeLanguageCode } from '@/localization/utils';
import { FetchStatus } from '@/utils/api';
import { CloudStorage, isCloudStorageAvailable } from '@/utils/storage';
import i18next from 'i18next';
import { create } from 'zustand';

interface User {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    avatar: string | null;
    birthday: string | null;
    country: string | null;
    town: string | null;
    address: string | null;
    postCode: string | null;
    status: 'Active' | 'Blocked';
    verificationLevel: 'None' | 'Base';
}

interface State {
    user: User | null;
    skipIntro: boolean;
    blurBalance: boolean;
    languageCode: string;
    userFetchStatus: FetchStatus;
    initialTopupOrder: InitialTopupOrder | null;
    initialPurchaseOrder: InitialPurchaseOrder | null;
}

interface Actions {
    setUser: (user: User) => void;
    setSkipIntro: (skip: boolean) => void;
    setBlurBalance: (blur: boolean) => void;
    setUserFetchStatus: (status: FetchStatus) => void;
    setInitialsPaymentOrders: (topup: InitialTopupOrder | null, purchase: InitialPurchaseOrder | null) => void;
    resetInitialsPaymentOrders: () => void;
    setLanguageCode: (lang: string) => void;
    loadUser: () => Promise<UserRes | boolean>;
}

const initIntro = () => {
    if (isCloudStorageAvailable()) {
        CloudStorage.get('skipIntro', (_, value) => {
            useUserStore.setState({ skipIntro: value === 'true' });
        });
        return false;
    }
    return localStorage.getItem('skipIntro') === 'true';
};

const initBlurBalance = () => {
    if (isCloudStorageAvailable()) {
        CloudStorage.get('blurBalance', (_, value) => {
            useUserStore.setState({ blurBalance: value === 'true' });
        });
        return false;
    }
    return localStorage.getItem('blurBalance') === 'true';
};

export const useUserStore = create<State & Actions>((set, get) => ({
    user: null,
    skipIntro: initIntro(),
    blurBalance: initBlurBalance(),
    languageCode: initLocalization(),
    userFetchStatus: FetchStatus.Idle,
    initialTopupOrder: null,
    initialPurchaseOrder: null,

    setUser: (user) => set({ user }),
    setSkipIntro: (skip) => {
        const storageValue = String(skip);
        if (isCloudStorageAvailable()) {
            CloudStorage.save('skipIntro', storageValue);
        } else {
            localStorage.setItem('skipIntro', storageValue);
        }
        set({ skipIntro: skip });
    },
    setBlurBalance: (blur) => {
        const storageValue = String(blur);
        if (isCloudStorageAvailable()) {
            CloudStorage.save('blurBalance', storageValue);
        } else {
            localStorage.setItem('blurBalance', storageValue);
        }
        set({ blurBalance: blur });
    },
    setLanguageCode: (languageCode) => {
        const safe = safeLanguageCode(languageCode);
        set({ languageCode: safe });
        i18next.changeLanguage(safe);
    },
    setUserFetchStatus: (userFetchStatus) => set({ userFetchStatus }),

    setInitialsPaymentOrders: (topup, purchase) => set({ initialTopupOrder: topup, initialPurchaseOrder: purchase }),
    resetInitialsPaymentOrders: () => set({ initialTopupOrder: null, initialPurchaseOrder: null }),

    loadUser: async () => {
        const { setUserFetchStatus, setUser, setInitialsPaymentOrders } = get();
        setUserFetchStatus(FetchStatus.Pending);
        try {
            const userData = await fetchUser();
            setUser({
                id: String(userData.userId),
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                avatar: userData.avatar,
                birthday: userData.birthday,
                country: userData.country,
                town: userData.town,
                address: userData.address,
                postCode: userData.postCode,
                status: userData.status,
                verificationLevel: userData.verificationLevel,
            });
            setUserFetchStatus(FetchStatus.Fulfilled);
            setInitialsPaymentOrders(userData.depositTransaction || null, userData.purchaseTransaction || null);
            return userData;
        } catch (error) {
            console.error('[error] ошибка получения данных пользователя', error);
            setUserFetchStatus(FetchStatus.Rejected);
            return false;
        }
    },
}));

export const useHasPaymentRestoreInitials = () => {
    return useUserStore(state => Boolean(state.initialPurchaseOrder || state.initialTopupOrder));
};

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getUserStore = () => useUserStore.getState();
}