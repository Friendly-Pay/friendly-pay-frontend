import { FetchStatus } from '@/utils/api';
import { CloudStorage, isCloudStorageAvailable } from '@/utils/storage';
import { create } from 'zustand';

interface State {
    onboardingShowed: boolean;
    onboardingShowedFetchStatus: FetchStatus;
}

interface Actions {
    loadOnboardingState: () => Promise<void>;
    updateOnboardingState: (showed: boolean) => Promise<void>;
}

const ONBOARDING_STORAGE_KEY = 'onboardingShowed';

const fetchOnboardingState = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (isCloudStorageAvailable()) {
            // Используем CloudStorage Telegram
            CloudStorage.get(ONBOARDING_STORAGE_KEY, (error, value) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(value === 'true');
            });
        } else {
            // Fallback на localStorage для dev режима и неподдерживаемых версий
            try {
                const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
                resolve(stored === 'true');
            } catch (err) {
                reject(err);
            }
        }
    });
};

const updateOnboardingState = async (showed: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
        const value = showed.toString();

        if (isCloudStorageAvailable()) {
            // Используем CloudStorage Telegram
            CloudStorage.save(ONBOARDING_STORAGE_KEY, value, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        } else {
            // Fallback на localStorage для dev режима и неподдерживаемых версий
            try {
                localStorage.setItem(ONBOARDING_STORAGE_KEY, value);
                resolve();
            } catch (err) {
                reject(err);
            }
        }
    });
};

export const useOnboardingStore = create<State & Actions>((set, get) => ({
    onboardingShowed: false,
    onboardingShowedFetchStatus: FetchStatus.Idle,

    loadOnboardingState: async () => {
        const { onboardingShowedFetchStatus } = get();

        // Если уже загружаем или загрузили, не делаем повторный запрос
        if (onboardingShowedFetchStatus === FetchStatus.Pending ||
            onboardingShowedFetchStatus === FetchStatus.Fulfilled) {
            return;
        }

        set({ onboardingShowedFetchStatus: FetchStatus.Pending });

        try {
            const showed = await fetchOnboardingState();
            set({
                onboardingShowed: showed,
                onboardingShowedFetchStatus: FetchStatus.Fulfilled
            });
        } catch (error) {
            console.error('Failed to load onboarding state:', error);
            set({
                onboardingShowed: false,
                onboardingShowedFetchStatus: FetchStatus.Rejected
            });
        }
    },

    updateOnboardingState: async (showed: boolean) => {
        set({ onboardingShowedFetchStatus: FetchStatus.Pending });

        try {
            await updateOnboardingState(showed);
            set({
                onboardingShowed: showed,
                onboardingShowedFetchStatus: FetchStatus.Fulfilled
            });
        } catch (error) {
            console.error('Failed to update onboarding state:', error);
            set({ onboardingShowedFetchStatus: FetchStatus.Rejected });
            // Откатываем состояние в случае ошибки
            const previousState = get().onboardingShowed;
            set({ onboardingShowed: previousState });
        }
    },
}));