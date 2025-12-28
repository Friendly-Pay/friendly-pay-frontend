
import { useAuthStore } from '../auth/store';
import { EmailVerificationCodeError, sendEmailVerificationCode, SignUpErrorResponse, signUpUser } from './fetch';
import { Routes } from '@/routes';
import { FetchStatus } from '@/utils/api';
import { ConfirmationState } from '@/views/Auth/EmailCode/components/types';
import i18next from 'i18next';
import { create } from 'zustand';

interface State {
    shouldLogin: boolean;
    typedEmail: string;
    confirmationState: ConfirmationState;
    confirmationServerError: string | null;
    confirmationCodeFetchStatus: FetchStatus;
    loginServerError: EmailVerificationCodeError | string | null;
    loginFetchStatus: FetchStatus;
    redirectUrl: string;
}

interface Actions {
    setShouldLogin: (should: boolean) => void;
    setTypedEmail: (email: string) => void;
    setConfirmationState: (state: ConfirmationState) => void;
    confirmEmail: (code: string) => Promise<void>;
    sendConfirmationCode: (email: string) => Promise<void>;
    resetConfirmationCodeServerError: () => void;
    resetLoginServerError: () => void;
    reset: () => void;
}

export const EMAIL_CONFIRMATION_CODE_LENGTH = 4;

export const useLoginStore = create<State & Actions>((set, get) => ({
    shouldLogin: false,
    typedEmail: '',
    confirmationState: 'INITIAL',
    confirmationCodeFetchStatus: FetchStatus.Idle,
    confirmationServerError: null,
    loginFetchStatus: FetchStatus.Idle,
    loginServerError: null,
    redirectUrl: '',

    setShouldLogin: (should) => {
        set({ shouldLogin: should });
    },

    setTypedEmail: (email) => {
        set({ typedEmail: email });
    },

    setConfirmationState: (state) => {
        set({ confirmationState: state });
    },

    confirmEmail: async (code) => {
        const { typedEmail, loginFetchStatus } = get();
        if (loginFetchStatus === FetchStatus.Pending) {
            return;
        }

        set({ loginFetchStatus: FetchStatus.Pending });

        const { authData, referralId } = useAuthStore.getState();
        if (!authData) {
            return;
        }
        try {
            const res = await signUpUser({
                email: typedEmail,
                verificationCode: code,
                webAppData: authData,
                referralId
            });

            const accessToken = res.token;
            const { setAccessToken, setIsAuth, setAuthFetchStatus } = useAuthStore.getState();
            useLoginStore.getState().setShouldLogin(false);
            setAuthFetchStatus(FetchStatus.Fulfilled);
            setAccessToken(accessToken);
            setIsAuth(true);

            set({
                redirectUrl: Routes.NEW_PRODUCT,
                loginFetchStatus: FetchStatus.Fulfilled
            });
        } catch (error: any) {
            set({ loginFetchStatus: FetchStatus.Rejected });

            if (error.response?.status === 400 && error.response?.data?.error) {
                const res = error.response.data as SignUpErrorResponse;
                set({ loginServerError: res.error });
            } else {
                throw error;
            }
        }
    },

    sendConfirmationCode: async (email) => {
        const confirmationCodeFetchStatus = get().confirmationCodeFetchStatus;
        if (confirmationCodeFetchStatus === FetchStatus.Pending) {
            return;
        }

        set({
            typedEmail: email,
            confirmationCodeFetchStatus: FetchStatus.Pending,
            redirectUrl: ''
        });

        try {
            await sendEmailVerificationCode(email);
            set({ confirmationCodeFetchStatus: FetchStatus.Fulfilled });
        } catch (error: any) {
            console.error('Ошибка при отправке кода', error);
            set({
                confirmationCodeFetchStatus: FetchStatus.Rejected,
                confirmationServerError: i18next.t('Failed to send the code')
            });
            throw error;
        }
    },

    resetConfirmationCodeServerError: () => {
        set({ confirmationServerError: null });
    },

    resetLoginServerError: () => {
        set({ loginServerError: null });
    },

    reset: () => {
        set({
            typedEmail: '',
            confirmationState: 'INITIAL',
            confirmationCodeFetchStatus: FetchStatus.Idle,
            confirmationServerError: null,
            loginServerError: null,
            redirectUrl: '',
        });
    }
}));