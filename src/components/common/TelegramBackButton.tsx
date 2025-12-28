import { Routes } from '@/routes';
import { useCardsStore } from '@/states/cards/store';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type RouteVisibility =
    | boolean
    | (() => boolean);

const VISIBILITY_ROUTES: Record<string, RouteVisibility> = {
    [Routes.EMAIL_CONFIRMATION]: true,
    [Routes.NEW_PRODUCT]: () => useCardsStore.getState().myCardsCount > 0,
    [Routes.USER_PROFILE]: true
};

export function TelegramBackButton({ children }: PropsWithChildren) {
    const location = useLocation();
    const navigate = useNavigate();
    const previousRoute = useRef(location.pathname);

    const currentRoute = location.pathname;
    const visibilityRule = VISIBILITY_ROUTES[currentRoute];
    const backButtonVisible = typeof visibilityRule === 'function' ? visibilityRule() : visibilityRule;

    const handleButtonClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        window.Telegram.WebApp.onEvent('backButtonClicked', handleButtonClick);
        return () => {
            window.Telegram.WebApp.offEvent('backButtonClicked', handleButtonClick);
        };
    }, []);

    useEffect(() => {
        const currentRoute = location.pathname;
        const showButton = backButtonVisible;
        if (showButton) {
            window.Telegram.WebApp.BackButton.show();
        } else {
            window.Telegram.WebApp.BackButton.hide();
        }
        previousRoute.current = currentRoute;
    }, [backButtonVisible]);

    useEffect(() => {
        return () => {
            window.Telegram.WebApp.BackButton.hide();
        };
    }, []);

    return <>
        {import.meta.env.DEV && backButtonVisible && (
            <div
                style={{ position: 'absolute', top: 'var(--safe-are-top)', left: '0', zIndex: '9999' }}
                onClick={handleButtonClick}
            >back</div>
        )}
        {children}
    </>;
}