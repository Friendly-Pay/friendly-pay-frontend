import { useTelegramFixScroll } from './hooks/telegram/useTelegramFixScroll';
import { useAuthData } from './states/auth/hooks';
import { useDetectDevice } from './states/device/hooks';
import { useUserAuth } from './states/user/hooks';
import { PropsWithChildren } from 'react';

export const AppHooks: React.FC<PropsWithChildren> = ({ children }) => {
    useTelegramFixScroll();
    useDetectDevice();
    useAuthData();
    useUserAuth();
    return (<>{children}</>);
};