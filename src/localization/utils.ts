export const safeLanguageCode = (languageCode = 'en') => {
    switch (languageCode) {
        case 'fa':
        case 'bn':
        case 'hi':
        case 'ar':
            return 'en';
        default:
            return languageCode;
    }
};

export const languageCodeToLocale = (languageCode: string) => {
    switch (languageCode) {
        case 'ru':
            return 'ru-RU';
        case 'zh':
            return 'zh-CN';
        case 'en':
        default:
            return 'en-US';
    }
};
