import { useAuthStore } from '../auth/store';
import { useCardsStore } from '../cards/store';
import { authUser, fetchUser } from './fetch';
import { useUserStore } from './store';
import { createSocketConnection } from '@/socket';
import { useSocketStore } from '@/socket/store';
import { FetchStatus } from '@/utils/api';
import { useEffect } from 'react';

export function useUserAuth() {
    const authData = useAuthStore(state => state.authData);
    const [setIsAuth, setAccessToken, setAuthFetchStatus] = useAuthStore(state => [
        state.setIsAuth,
        state.setAccessToken,
        state.setAuthFetchStatus
    ]);

    const authSession = async () => {
        setAuthFetchStatus(FetchStatus.Pending);
        try {
            const res = await authUser({ webAppData: authData! });
            setAuthFetchStatus(FetchStatus.Fulfilled);
            setAccessToken(res.accessToken);
            return res.accessToken;
        } catch (error) {
            console.error('[error] ошибка авторизации', error);
            setAuthFetchStatus(FetchStatus.Rejected);
            return null;
        }
    };

    const [setUser, setUserFetchStatus] = useUserStore(state => [
        state.setUser,
        state.setUserFetchStatus,
    ]);

    const loadUserData = async () => {
        setUserFetchStatus(FetchStatus.Pending);
        try {
            const userData = await fetchUser();
            setUser({
                id: String(userData.userId),
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                avatar: userData.avatar,
                status: userData.status,
                verificationLevel: userData.verificationLevel
            });
            setUserFetchStatus(FetchStatus.Fulfilled);
            return userData;
        } catch (error) {
            console.error('[error] ошибка получения данных пользователя', error);
            setUserFetchStatus(FetchStatus.Rejected);
            return false;
        }
    };

    const setSocketReady = useSocketStore(state => state.setSocketReady);
    const initSocket = (accessToken: string) => {
        createSocketConnection(accessToken);
        setSocketReady(true);
    };

    const loadCardsTypes = useCardsStore(state => state.loadCardsTypes);
    const auth = async () => {
        const accessToken = await authSession();
        if (accessToken) {
            await Promise.all([
                loadUserData(),
                loadCardsTypes()
            ]);
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