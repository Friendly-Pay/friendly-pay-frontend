import { fetchUser, InitialPurchaseOrder, InitialTopupOrder, UserRes } from './fetch';
import { initLocalization } from '@/localization';
import { safeLanguageCode } from '@/localization/utils';
import { FetchStatus } from '@/utils/api';
import { CloudStorage, isCloudStorageAvailable } from '@/utils/storage';
import i18next from 'i18next';
import { create } from 'zustand';

export enum VerificationStatus {
    Idle = 'Idle',
    Pending = 'InProgress',
    Success = 'Success',
    NeedAction = 'NeedAction',
    Failed = 'Failed'
}

interface User {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    country: string | null;
    avatar: string | null;
    status: 'Active' | 'Blocked';
    verificationStatus: VerificationStatus;
}

interface State {
    user: User | null;
    skipIntro: boolean;
    blurBalance: boolean;
    languageCode: string;
    userFetchStatus: FetchStatus;
    initialTopupOrder: InitialTopupOrder | null;
    initialPurchaseOrder: InitialPurchaseOrder | null;
    /**
     * Карта, на которую проходил KYC. null после покупки карты
     * 
     *  @TODO позже проверять, доступна ли пользователю. Если нет - выводить специальный стейт
     * 
     * */
    initialPurchaseCardTypeId: number | null;
}

interface Actions {
    setUser: (user: User) => void;
    setSkipIntro: (skip: boolean) => void;
    setBlurBalance: (blur: boolean) => void;
    setUserFetchStatus: (status: FetchStatus) => void;
    setInitialPaymentOrders: (topup: InitialTopupOrder | null, purchase: InitialPurchaseOrder | null) => void;
    resetInitialPaymentOrders: () => void;
    setInitialPurchaseCardTypeId: (cardTypeId: number | null) => void;
    resetInitualPurchaseCardTypeId: () => void;
    setLanguageCode: (lang: string) => void;
    loadUser: (params?: { includePaymentInitials: boolean }) => Promise<UserRes | void>;
    refetchUser: () => Promise<UserRes | void>;
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
    initialPurchaseCardTypeId: null,

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

    setUserFetchStatus: (userFetchStatus) => set({ userFetchStatus }),

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

    // Payment orders initials
    setInitialPaymentOrders: (topup, purchase) => set({ initialTopupOrder: topup, initialPurchaseOrder: purchase }),
    resetInitialPaymentOrders: () => set({ initialTopupOrder: null, initialPurchaseOrder: null }),

    // Purchase CardTypeId initial
    setInitialPurchaseCardTypeId: (cardTypeId) => set({ initialPurchaseCardTypeId: cardTypeId }),
    resetInitualPurchaseCardTypeId: () => set({ initialPurchaseCardTypeId: null }),

    loadUser: async ({ includePaymentInitials } = { includePaymentInitials: true }) => {
        const { setUserFetchStatus, setUser, setInitialPaymentOrders, setInitialPurchaseCardTypeId } = get();
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
                country: userData.country,
                status: userData.status,
                verificationStatus: userData.verificationStatus as VerificationStatus,
            });

            setUserFetchStatus(FetchStatus.Fulfilled);
            if (includePaymentInitials) {
                setInitialPaymentOrders(userData.depositTransaction || null, userData.purchaseTransaction || null);
                setInitialPurchaseCardTypeId(userData.selectedCardTypeId);
            }
            return userData;
        } catch (error) {
            console.error('[error] ошибка получения данных пользователя', error);
            setUserFetchStatus(FetchStatus.Rejected);
            return;
        }
    },

    refetchUser: async () => {
        const load = get().loadUser;
        return load({ includePaymentInitials: false }); // Чтобы не вызвать срабатывание PaymentRestore
    }
}));

export const useHasPaymentRestoreInitials = () => {
    return useUserStore(state => Boolean(state.initialPurchaseOrder || state.initialTopupOrder));
};

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getUserStore = () => useUserStore.getState();
}