import { translations } from './translations';
import { safeLanguageCode } from './utils';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// @TODO сделать переводы каждый язык отдельным файлом - подгружаем просто нужный
export const lsLanguageKey = 'preferredLanguage';
export const getPreferredLanguage = (): string => {
    const defaultLanguage = 'en';
    try {
        const storedLanguage = localStorage.getItem(lsLanguageKey);
        if (storedLanguage) {
            return safeLanguageCode(storedLanguage);
        }
        localStorage.setItem(lsLanguageKey, defaultLanguage);
        return defaultLanguage;
    } catch (error) {
        console.error('Unable to parse language code', error);
        return defaultLanguage;
    }
};

export const initLocalization = () => {
    const lng = getPreferredLanguage();
    i18next
        .use(initReactI18next)
        .init({
            fallbackLng: false,
            lng,
            defaultNS: 'translates',
            resources: translations,
            interpolation: {
                escapeValue: false
            },
        });
    return lng;
};