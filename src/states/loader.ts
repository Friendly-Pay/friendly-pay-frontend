import { useCardsStore } from './cards/store';
import { useGlobalStore } from './global';
import { useOnboardingStore } from './onboarding/store';
import { TOPUP_BLUR_IMAGE } from '@/components/Payment/TopupResult';
import { loadDomImage } from '@/utils/preload';
import { create } from 'zustand';

interface State {
    isPreloadFinished: boolean;
    isMainLoadFinished: boolean;

    isFlowRedirectProcessed: boolean;

    /** Видимость глобального лоадера */
    isGlobalPreloaderVisible: boolean;
}

interface Actions {
    setIsPreloadFinished: (initiated: boolean) => void;
    setIsMainLoadFinished: (initiated: boolean) => void;
    setIsFlowRedirectProcessed: (processed: boolean) => void;
    setIsGlobalPreloaderVisible: (visible: boolean) => void;
}

export const useLoaderStore = create<State & Actions>((set) => ({
    isPreloadFinished: false,
    isMainLoadFinished: false,
    isFlowRedirectProcessed: false,
    isGlobalPreloaderVisible: true,

    setIsMainLoadFinished: (loaded) =>
        set({ isMainLoadFinished: loaded }),

    setIsPreloadFinished: (loaded) =>
        set({ isPreloadFinished: loaded }),

    setIsFlowRedirectProcessed: (processed) =>
        set({ isFlowRedirectProcessed: processed }),

    setIsGlobalPreloaderVisible: (visible) => {
        set({ isGlobalPreloaderVisible: visible });
    }
}));

export class LoaderActions {
    static async preload() {
        await useOnboardingStore.getState().loadOnboardingState();
        useLoaderStore.getState().setIsPreloadFinished(true);
    }

    static async mainLoad() {
        const { loadGlobalSettings } = useGlobalStore.getState();
        const { loadCardsTypes, loadMyCards } = useCardsStore.getState();
        await Promise.all([
            await loadGlobalSettings(),
            await loadCardsTypes(),
            await loadMyCards(),
        ]);
        await loadDomImage(TOPUP_BLUR_IMAGE, 'anonymous');
        useLoaderStore.getState().setIsMainLoadFinished(true);
    }
}