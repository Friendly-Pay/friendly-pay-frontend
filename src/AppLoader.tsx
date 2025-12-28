import { useAuthStore } from '@/states/auth/store';
import { LoaderActions, useLoaderStore } from '@/states/loader';
import { FetchStatus } from '@/utils/api';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

const AppLoader: React.FC<PropsWithChildren> = ({ children }) => {
    const isAuth = useAuthStore(state => state.isAuth);
    const isPreloadFinished = useLoaderStore(state => state.isPreloadFinished);
    const isMainLoadFinished = useLoaderStore(state => state.isMainLoadFinished);
    const authFetchStatus = useAuthStore(state => state.authFetchStatus);

    const showUILoader = useCallback(() => {
        useLoaderStore.getState().setIsGlobalPreloaderVisible(true);
    }, []);

    const hideUILoader = useCallback(() => {
        useLoaderStore.getState().setIsGlobalPreloaderVisible(false);
    }, []);

    const appLoadStarted = useRef(false);
    const rootLoadStarted = useRef(false);

    const isAuthRequestFinished = authFetchStatus === FetchStatus.Rejected || authFetchStatus === FetchStatus.Fulfilled;

    // Предварительная загрузка
    useEffect(() => {
        if (!isAuthRequestFinished) {
            return;
        }
        if (!rootLoadStarted.current) {
            rootLoadStarted.current = true;
            LoaderActions.preload();
        }
    }, [isAuthRequestFinished]);

    // Основная загрузка
    useEffect(() => {
        if (!isPreloadFinished || appLoadStarted.current) {
            return;
        }

        const mainLoadStart = async () => {
            showUILoader();
            if (isAuth) {
                appLoadStarted.current = true;
                await LoaderActions.mainLoad();
            }
            hideUILoader();
        };

        mainLoadStart();
    }, [isPreloadFinished, isAuth]);

    if (!isPreloadFinished) {
        return null;
    }

    // Ждем, пока идем основная загрузка после авторизации
    if (!isMainLoadFinished && isAuth) {
        return null;
    }

    return (<>{children}</>);
};

export default AppLoader;