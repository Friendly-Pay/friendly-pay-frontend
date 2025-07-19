import { fetchUserCountry } from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

export enum VerificationStage {
    Preloading = 'preloading',
    PersonalData = 'personalData',
    Address = 'address',
    Email = 'email',
    PhoneNumber = 'phoneNumber'
}

interface VerificationState {
    stage: VerificationStage;
    data: {
        cardId: number | null,
        phoneNumber: string | null;
        firstName: string | null;
        lastName: string | null;
        birthday: string | null;
        email: string | null;
        country: string | null;
        town: string | null;
        address: string | null;
        postCode: string | null;
    };
    initialCountryCode: string | null
    initialCountryCodeStatus: FetchStatus | null
}

interface VerificationActions {
    setStage: (stage: VerificationStage) => void;
    setCardId: (cardId: number) => void;
    setUserDataProperty: <K extends keyof VerificationState['data']>(
        key: K,
        value: VerificationState['data'][K]
    ) => void;
    loadInitialCountryCode: () => Promise<void>;
    resetVerification: () => void;
}

export const useVerificationStore = create<VerificationState & VerificationActions>((set) => ({
    stage: VerificationStage.Preloading,
    data: {
        cardId: null,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        birthday: null,
        email: null,
        country: null,
        town: null,
        address: null,
        postCode: null
    },
    initialCountryCode: null,
    initialCountryCodeStatus: FetchStatus.Idle,

    setStage: (stage) => set({ stage }),
    setCardId: (cardId) => set(state => ({ data: { ...state.data, cardId } })),

    setUserDataProperty: (key, value) =>
        set((state) => ({
            data: {
                ...state.data,
                [key]: value,
            },
        })),

    loadInitialCountryCode: async () => {
        set({ initialCountryCodeStatus: FetchStatus.Pending });
        try {
            const code = await fetchUserCountry();
            set({
                initialCountryCode: code,
                initialCountryCodeStatus: FetchStatus.Fulfilled
            });
        } catch {
            set({ initialCountryCodeStatus: FetchStatus.Rejected });
        }
    },

    resetVerification: () => {
        set({
            stage: VerificationStage.Preloading,
            data: {
                cardId: null,
                phoneNumber: null,
                firstName: null,
                lastName: null,
                birthday: null,
                email: null,
                country: null,
                town: null,
                address: null,
                postCode: null
            }
        });
    }
}));