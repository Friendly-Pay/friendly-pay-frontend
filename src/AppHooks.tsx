
import { useTelegramFixScroll } from './hooks/telegram/useTelegramFixScroll';
import { useUserLanguage } from './localization/hooks';
import { useAuthData } from './states/auth/hooks';
import { useDetectDevice } from './states/device/hooks';
import { useUserAuth } from './states/user/hooks';
import { PropsWithChildren } from 'react';

export function AppHooks({ children }: PropsWithChildren) {
    useTelegramFixScroll();
    useUserLanguage();
    useDetectDevice();
    useAuthData();
    useUserAuth();
    return (<>{children}</>);
}