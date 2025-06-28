import { useUserStore } from '../user/store';
import { completeVerificationLevel1 } from './fetch';
import { AxiosError } from 'axios';
import { create } from 'zustand';

export enum VerificationStage {
    Intro = 'intro',
    PhoneNumber = 'phoneNumber',
    PersonalData = 'personalData',
    Country = 'country',
    NeedConfirm = 'needConfirm',
    Success = 'success',
    Failed = 'failed'
}

interface VerificationState {
    stage: VerificationStage;
    data: {
        phoneNumber: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        country: string | null;
        birthday: string | null;
    }
    completeError: string | null;
}

interface VerificationActions {
    setStage: (stage: VerificationStage) => void;
    setUserDataProperty: <K extends keyof VerificationState['data']>(
        key: K,
        value: VerificationState['data'][K]
    ) => void;
    completeVerification: () => Promise<void>;
    resetVerification: () => void;
}


export const useVerificationStore = create<VerificationState & VerificationActions>((set, get) => ({
    stage: VerificationStage.Intro,
    data: {
        phoneNumber: null,
        firstName: null,
        lastName: null,
        email: null,
        country: null,
        birthday: null,
    },
    completeError: null,

    setStage: (stage) => set({ stage }),

    setUserDataProperty: (key, value) =>
        set((state) => ({
            data: {
                ...state.data,
                [key]: value,
            },
        })),

    completeVerification: async () => {
        const { data } = get();
        set({ completeError: null });
        try {
            await completeVerificationLevel1({
                phoneNumber: data.phoneNumber!,
                firstName: data.firstName!,
                lastName: data.lastName!,
                email: data.email!,
                birthday: data.birthday!
            });
            await useUserStore.getState().refetchUser();
            set({ stage: VerificationStage.Success });
        } catch (error: any) {
            console.error('[completeVerification]', error);
            let completeError: any;
            if (error instanceof AxiosError) {
                completeError = String(error.response?.data);
            }
            if (!completeError) {
                completeError = error.message;
            }
            set({ stage: VerificationStage.Failed, completeError });
        }
    },

    resetVerification: () => {
        set({
            stage: VerificationStage.Intro,
            data: {
                phoneNumber: null,
                firstName: null,
                lastName: null,
                email: null,
                country: null,
                birthday: null,
            },
            completeError: null
        });
    }
}));