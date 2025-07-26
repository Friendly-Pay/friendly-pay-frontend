import { translations } from './translates/translations';
import { safeLanguageCode } from './utils';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const languages = [
    { emoji: '🇬🇧', name: 'English', locale: 'en' },
    { emoji: '🇷🇺', name: 'Русский', locale: 'ru' },
    // { emoji: '🇮🇹', name: 'Italiano', locale: 'it' },
    // { emoji: '🇨🇳', name: '中文', locale: 'zh' },
];

export const lsLanguageKey = 'preferredLanguage';

export const getPreferredLanguage = (): string => {
    try {
        const storedLanguage = localStorage.getItem(lsLanguageKey);
        return storedLanguage ? safeLanguageCode(storedLanguage) : '';
    } catch (error) {
        console.error('Unable to parse language code', error);
        return '';
    }
};

export const savePreferredLanguage = (language: string) => {
    const safeLanguage = safeLanguageCode(language);
    try {
        localStorage.setItem(lsLanguageKey, safeLanguage);
    } catch (error) {
        console.error('Unable to save language code', error);
    }
};

export const initLocalization = () => {
    const lng = getPreferredLanguage() || 'en';
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