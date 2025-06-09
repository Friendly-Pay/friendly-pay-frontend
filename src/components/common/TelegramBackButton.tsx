import { useCardsStore } from '@/states/cards/store';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

let previousRoute: any = '';

export function TelegramBackButton({ children }: PropsWithChildren) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleBackButtonClick = () => {
            navigate(-1);
        };

        window.Telegram.WebApp.onEvent('backButtonClicked', handleBackButtonClick);

        if (location.pathname !== previousRoute) {
            const onHomePage = location.pathname === '/';
            const onResultPage = location.pathname === '/payments/topup/result' || location.pathname === '/payments/pay-new-card/result';

            // Когда нет карт
            const onHomeNewProductPage = useCardsStore.getState().myCardsCount === 0 && location.pathname === '/new-product';

            if (onHomePage || onHomeNewProductPage || onResultPage) {
                window.Telegram.WebApp.BackButton.hide();
            } else {
                window.Telegram.WebApp.BackButton.show();
            }

            previousRoute = location.pathname;
        }

        return () => {
            window.Telegram.WebApp.offEvent('backButtonClicked', handleBackButtonClick);
        };
    }, [location, navigate]);

    return <>{children}</>;
}