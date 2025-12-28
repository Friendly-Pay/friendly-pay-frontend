import { isUserOnAuthRoutes, Routes } from '@/routes';
import { useAuthStore } from '@/states/auth/store';
import { useCardsStore } from '@/states/cards/store';
import { useLoaderStore } from '@/states/loader';
import { useLoginStore } from '@/states/login/store';
// import { useOnboardingRedirect } from '@/states/onboarding/hooks';
import { useSumsubStore } from '@/states/sumsub/store';
import { useUserStore, VerificationStatus } from '@/states/user/store';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type RedirectState =
    | 'ACTIVE_SUMSUB' // Показать результат SumSub
    | 'NO_ACTIVE_PRODUCTS' // Нет активных продуктов
    | 'PURCHASE_SELECTED_CARD' // Оплатить карту, выбранную при логине


const redirectStateToUrl: Record<RedirectState, string> = {
    'ACTIVE_SUMSUB': Routes.SUMSUB_START,
    'NO_ACTIVE_PRODUCTS': Routes.NEW_PRODUCT,
    'PURCHASE_SELECTED_CARD': Routes.CARD_PURCHASE
};

const UserFlow = ({ children }: PropsWithChildren) => {
    const isAuth = useAuthStore(state => state.isAuth);
    const isMainLoadFinished = useLoaderStore(state => state.isMainLoadFinished);
    const shouldLogin = useLoginStore(state => state.shouldLogin);
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const verificationStatus = useUserStore(state => state.user?.verificationStatus);
    const initialPurchaseCardTypeId = useUserStore(state => state.initialPurchaseCardTypeId);

    // @TODO включить
    // useOnboardingRedirect();

    const location = useLocation();

    const shouldUserRedirectToSumsub = () => {
        if (!verificationStatus) return false;
        const finalStatuses = [VerificationStatus.Idle, VerificationStatus.Success];
        return !finalStatuses.includes(verificationStatus);
    };

    const [redirectState, setRedirectState] = useState<RedirectState | undefined>();
    const isRedirectProcessed = useLoaderStore(state => state.isFlowRedirectProcessed);

    const completeRedirect = () => {
        useLoaderStore.getState().setIsFlowRedirectProcessed(true);
    };

    useEffect(() => {
        if (redirectState || isRedirectProcessed) {
            return;
        }
        if (!isMainLoadFinished) {
            return;
        }

        if (verificationStatus === VerificationStatus.Idle && myCardsCount === 0) {
            setRedirectState('NO_ACTIVE_PRODUCTS');
        } else if (shouldUserRedirectToSumsub()) {
            if (initialPurchaseCardTypeId) {
                useSumsubStore.getState().setSelectedCardTypeId(initialPurchaseCardTypeId);
            }
            setRedirectState('ACTIVE_SUMSUB');
        } else {
            completeRedirect();
        }
    }, [isMainLoadFinished]);

    useEffect(() => {
        // Полная загрузка будет позже, редирект уже не нужен
        const mainLoadDelayed = !isAuth && shouldLogin;

        if (redirectState || mainLoadDelayed) {
            completeRedirect();
        }
    }, [redirectState, isAuth, shouldLogin]);

    // Редирект после полной загрузки
    if (!isRedirectProcessed) {
        if (redirectState) {
            return (
                <Navigate
                    to={redirectStateToUrl[redirectState]}
                    replace
                />
            );
        }
        return null;
    }

    // Отправить на вход
    if (!isAuth && shouldLogin) {
        if (!isUserOnAuthRoutes(location)) {
            return (
                <Navigate
                    to={Routes.AUTH_LOGIN}
                    replace
                />
            );
        }
    }

    return <>{children}</>;
};

export default UserFlow;