import { lsLanguageKey } from '.';
import { useUserStore } from '@/states/user/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useUserLanguage = () => {
    const { i18n } = useTranslation();
    const userLanguage = useUserStore((state) => state.languageCode);

    useEffect(() => {
        i18n.changeLanguage(userLanguage);
        localStorage.setItem(lsLanguageKey, userLanguage);
    }, [userLanguage]);
};