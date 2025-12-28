import { useOnboardingStore } from './store';
import { Routes } from '@/routes';
import { FetchStatus } from '@/utils/api';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useOnboardingRedirect = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const onboardingShowed = useOnboardingStore(state => state.onboardingShowed);
    const onboardingShowedFetchStatus = useOnboardingStore(state => state.onboardingShowedFetchStatus);

    const redirectDone = useRef(false);

    useEffect(() => {
        if (redirectDone.current) return;

        if (!onboardingShowed && onboardingShowedFetchStatus === FetchStatus.Fulfilled) {
            if (!location.pathname.includes(Routes.ONBOARDING)) {
                navigate(Routes.ONBOARDING, { replace: true });
                redirectDone.current = true;
            }
        }
    }, [location, onboardingShowed, onboardingShowedFetchStatus, navigate]);
};