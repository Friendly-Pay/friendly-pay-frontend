import { useUserStore } from '../user/store';
import { useAuthStore } from './store';
import { getPreferredLanguage } from '@/localization';
import { useEffect } from 'react';

export function useAuthData() {
    const isTMA = Boolean(window?.Telegram?.WebApp?.initData && window.Telegram.WebApp.initData !== '');

    const getAuthData = () => {
        if (import.meta.env.DEV) {
            console.warn('Auth Data Debug');
            return import.meta.env.VITE_DEV_USER_INIT_DATA;
        }
        if (isTMA) {
            return window.Telegram.WebApp.initData;
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('initData')) {
            try {
                return atob(urlParams.get('initData') as string);
            } catch (error) {
                console.error('[error] ошибка декодирования initData из url', error);
                return null;
            }
        }

        return null;
    };

    const getUserLanguage = (authData: string) => {
        try {
            const param = new URLSearchParams(authData).get('user');
            if (param) {
                const user = JSON.parse(decodeURIComponent(param));
                return user.language_code || 'en';
            }
            return 'en';
        } catch (error) {
            console.error('[error] ошибка декодирования языка из authData', error);
            return 'en';
        }
    };

    const getReferralId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const referralId = urlParams.get('referral_id');
        return referralId;
    };

    const setAuthData = useAuthStore(state => state.setAuthData);
    const setReferralId = useAuthStore(state => state.setReferralId);
    const setLanguageCode = useUserStore(state => state.setLanguageCode);
    useEffect(() => {
        const authData = getAuthData();
        if (authData) {
            const preferredLanguage = getPreferredLanguage();
            if (!preferredLanguage) {
                const language = getUserLanguage(authData);
                setLanguageCode(language);
            }
            const referralId = getReferralId();
            if (referralId) {
                setReferralId(referralId);
            }
            setAuthData(authData);
        }
    }, []);
}