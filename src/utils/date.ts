import i18next from 'i18next';

const getDayLabel = (dateInput: Date | string | number): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const targetDate = new Date(dateInput);
    targetDate.setHours(0, 0, 0, 0);
    if (targetDate.getTime() === today.getTime()) {
        return i18next.t('Today');
    } else if (targetDate.getTime() === yesterday.getTime()) {
        return i18next.t('Yesterday');
    }
    const supported = Intl.DateTimeFormat.supportedLocalesOf(i18next.language);
    const locale = supported.length > 0 ? supported[0] : 'en';
    const dateDay = targetDate.getDate();
    const dateParts = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).formatToParts(targetDate);
    const dateMonth = dateParts.find(p => p.type === 'month')?.value || new Intl.DateTimeFormat(locale, { month: 'long' }).format(targetDate);
    const dateYear = targetDate.getFullYear();
    return dateYear === today.getFullYear() ? `${dateDay} ${dateMonth}` : `${dateDay} ${dateMonth}, ${dateYear}`;
};

export const formatDateWithLabel = (dateInput: Date): string => {
    const hours = String(dateInput.getHours()).padStart(2, '0');
    const minutes = String(dateInput.getMinutes()).padStart(2, '0');
    return `${getDayLabel(dateInput)} ${i18next.t('at')} ${hours}:${minutes}`;
};

export const formatCardExpiration = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1_000);
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    return `${month} / ${year}`;
};

export const formatApproximateSeconds = (approximateSeconds: number, t: any) => {
    if (approximateSeconds >= 60) {
        const minutes = Math.floor(approximateSeconds / 60);
        return `${minutes} ${t('min')}`;
    } else {
        return `${approximateSeconds} ${t('sec')}`;
    }
};

const DATE_PART_TOKENS = {
    day: 'dd',
    month: 'mm',
    year: 'yyyy'
};

export const getDateFormatData = (locale: string = 'en') => {
    let resolvedLocale = 'en-gb';
    if (locale !== 'en') {
        resolvedLocale = Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0 ? locale : resolvedLocale;
    }
    if (locale === 'ar') {
        resolvedLocale = 'en-gb';
    }
    const dateFormatParts = new Intl.DateTimeFormat(resolvedLocale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }).formatToParts();
    const separator =
        dateFormatParts.find((part) => part.type === 'literal')?.value.trim() || '/';
    const format = dateFormatParts.reduce((accumulator, part) => {
        if (part.type in DATE_PART_TOKENS) {
            const token = DATE_PART_TOKENS[part.type as keyof typeof DATE_PART_TOKENS];
            return accumulator ? `${accumulator}/${token}` : token;
        }
        return accumulator;
    }, '');

    return { separator, format };
};

export const parseDateFromFormattedString = (dateString: string, formatTemplate: string) => {
    const formatParts = formatTemplate.split('/');
    const dateNumbers = dateString.split('/').map(part => Number(part));
    const monthIndex = formatParts.indexOf(DATE_PART_TOKENS.month);
    const dayIndex = formatParts.indexOf(DATE_PART_TOKENS.day);
    const yearIndex = formatParts.indexOf(DATE_PART_TOKENS.year);
    const fullYear = dateNumbers[yearIndex] < 100 ? dateNumbers[yearIndex] + 100 : dateNumbers[yearIndex];
    return new Date(fullYear, dateNumbers[monthIndex] - 1, dateNumbers[dayIndex]);
};

export const formatExpireDaysAsMonths = (
    expireDays: number,
    averageDaysPerMonth = 31
): string => {
    const months = Math.max(0, Math.ceil(expireDays / averageDaysPerMonth));
    const unit = i18next.t('mo');
    return `${months} ${unit}`;
};