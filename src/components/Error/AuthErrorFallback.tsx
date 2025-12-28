import { useAuthStore } from '@/states/auth/store';
import { useLoginStore } from '@/states/login/store';
import { useUserStore } from '@/states/user/store';
import { FetchStatus } from '@/utils/api';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// @TODO переделать
export function AuthErrorFallback({ children }: PropsWithChildren) {
    const [t] = useTranslation();
    const shouldLogin = useLoginStore((state) => state.shouldLogin);
    const authFetchStatus = useAuthStore((state) => state.authFetchStatus);
    const userFetchStatus = useUserStore((state) => state.userFetchStatus);

    const alertOpened = useRef(false);

    useEffect(() => {
        if (shouldLogin) return;
        if (alertOpened.current) return;

        // @TODO надо чтобы не выскакивал спустя время
        // Если sign-in и 401 - значит такого пользователя нет
        // Если 401 на других запросах - значит токен истек
        if (authFetchStatus === FetchStatus.Rejected || userFetchStatus === FetchStatus.Rejected) {
            alertOpened.current = true;
            window.Telegram.WebApp.showAlert(t('Problems logging into the app. Please try again later'), () => alertOpened.current = false);
        }
    }, [shouldLogin, authFetchStatus, userFetchStatus]);

    return <>{children}</>;
}