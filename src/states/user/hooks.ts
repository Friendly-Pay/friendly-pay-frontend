import { authUser } from '../auth/fetch';
import { useAuthStore } from '../auth/store';
import { useLoginStore } from '../login/store';
import { useUserStore } from './store';
import { createSocketConnection } from '@/socket';
import { useSocketStore } from '@/socket/store';
import { FetchStatus } from '@/utils/api';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

export const useUserAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authData = useAuthStore(state => state.authData);
    const accessToken = useAuthStore(state => state.accessToken);
    const setIsAuth = useAuthStore(state => state.setIsAuth);
    const setAccessToken = useAuthStore(state => state.setAccessToken);
    const setAuthFetchStatus = useAuthStore(state => state.setAuthFetchStatus);

    const authSession = async () => {
        setAuthFetchStatus(FetchStatus.Pending);
        try {
            const referralId = urlParams.get('referral_id');
            const res = await authUser({ webAppData: authData!, referralId });
            setAuthFetchStatus(FetchStatus.Fulfilled);
            setAccessToken(res.token);
            setIsAuth(true);
            return res.token;
        } catch (error: any) {
            if (error instanceof AxiosError && error.code === '401' || error.response?.status === 401) {
                useLoginStore.getState().setShouldLogin(true);
            } else {
                console.error('[error] ошибка авторизации', error);
            }
            setAuthFetchStatus(FetchStatus.Rejected);
            return null;
        }
    };

    const setSocketReady = useSocketStore(state => state.setSocketReady);
    const initSocket = (accessToken: string) => {
        createSocketConnection(accessToken);
        setSocketReady(true);
    };

    useEffect(() => {
        if (authData) {
            authSession();
        }
    }, [authData]);

    useEffect(() => {
        if (accessToken) {
            useUserStore.getState().loadUser();
            initSocket(accessToken);
        }
    }, [accessToken]);
};