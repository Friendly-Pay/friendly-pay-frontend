import { useAuthStore } from '../auth/store';
import { authUser } from './fetch';
import { useUserStore } from './store';
import { createSocketConnection } from '@/socket';
import { useSocketStore } from '@/socket/store';
import { FetchStatus } from '@/utils/api';
import { useEffect } from 'react';

export function useUserAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const authData = useAuthStore(state => state.authData);
    const [setIsAuth, setAccessToken, setAuthFetchStatus] = useAuthStore(state => [
        state.setIsAuth,
        state.setAccessToken,
        state.setAuthFetchStatus
    ]);

    const authSession = async () => {
        setAuthFetchStatus(FetchStatus.Pending);
        try {
            const referralId = urlParams.get('referral_id');
            const res = await authUser({ webAppData: authData!, referralId });
            setAuthFetchStatus(FetchStatus.Fulfilled);
            setAccessToken(res.accessToken);
            return res.accessToken;
        } catch (error) {
            console.error('[error] ошибка авторизации', error);
            setAuthFetchStatus(FetchStatus.Rejected);
            return null;
        }
    };

    const setSocketReady = useSocketStore(state => state.setSocketReady);
    const initSocket = (accessToken: string) => {
        createSocketConnection(accessToken);
        setSocketReady(true);
    };

    const auth = async () => {
        const accessToken = await authSession();
        if (accessToken) {
            await useUserStore.getState().loadUser();
            initSocket(accessToken);
            setIsAuth(true);
        }
    };

    useEffect(() => {
        if (authData) {
            auth();
        }
    }, [authData]);
}