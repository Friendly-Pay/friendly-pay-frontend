import parsePhoneNumberFromString from 'libphonenumber-js';

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const formatUsername = (username: string) => `${username.includes('@') ? '' : '@'}${username}`;

export const formatUserFirstNameAndLastName = (firstName: string, lastName: string) => {
    const name = firstName.trim();
    const last = lastName.trim();
    const initial = last ? ` ${last.charAt(0).toUpperCase()}.` : '';
    return `${name}${initial}`;
};

export const removeAtSymbol = (username: string) => username.replace('@', '');

export const formatCardNumber = (number: string) => {
    const digits = number.replace(/\D/g, '');
    return digits.match(/.{1,4}/g)?.join(' ') || number;
};

export const formatCardLastFourDigits = (digits: string | number) => `${String(digits).length > 4 ? digits : `•• ${digits}`}`;

export function formatPhoneNumber(phone: string | null | undefined): string {
    if (!phone) return '';
    let phoneNumber = phone.trim();
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+${phoneNumber}`;
    }
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (!parsed) return phoneNumber;
    return parsed.formatInternational();
}

export const truncateText = (text: string, maxLength: number = 18, addEllipsis: boolean = true) =>
    !text || !text.slice ? text : text.slice(0, maxLength) + (text.length > maxLength && addEllipsis ? '...' : '');

// @TODO не создавать каждый раз new Intl.NumberFormat
export const formatCurrency = (amount: string | number, currency: string, locale: string, minimumFractionDigits = 2) => {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(number)) {
        return amount;
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits: 2
    }).format(number);
};

export const formatTokenCurrency = (amount: string | number, locale: string, maximumFractionDigits = 6) => {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(number)) {
        return amount;
    }
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits
    }).format(number);
};

export const abbreviateNumber = (value: number, t: any, decimals = 0) => {
    const rules = [
        { limit: 1e6, div: 1e6, suf: 'M' },
        { limit: 1e5, div: 1e3, suf: 'k' },
    ] as const;

    for (const { limit, div, suf } of rules) {
        if (value >= limit) {
            const num = +(value / div).toFixed(decimals);
            return `${num} ${t(suf)}`;
        }
    }

    return value;
};

export const openWebviewLink = (url: string, options: { try_instant_view?: boolean } = {}) => {
    window.Telegram.WebApp.openLink(url, options);
};

export const openTelegramLink = (username: string) => {
    window.Telegram.WebApp.openTelegramLink(username);
};

export const urlSearchParams = (params: Record<string, string | number | boolean | undefined | null>) => {
    return new URLSearchParams(
        JSON.parse(
            JSON.stringify({
                ...params,
            }),
        ),
    );
};

export const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const blurFocusedInput = () => {
    // @ts-ignore
    document.querySelector('input:focus, textarea:focus')?.blur();
};

export const supportsNarrowCurrencyDisplay = () => {
    try {
        Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol'
        });
    } catch (_) {
        return false;
    }
    return true;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Clipboard API error:', error);
        }
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-99999px';
    document.body.prepend(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
    } catch (error) {
        console.error('execCommand copy error:', error);
        textArea.remove();
        return false;
    }
};

export const loadEruda = () => {
    if (document.querySelector('#eruda')) return;

    const script = document.createElement('script');
    script.onload = () => {
        if ('eruda' in window) {
            try {
                // @ts-ignore
                window.eruda.init();
            } catch (error) {
                console.error('Ошибка инициализации Eruda:', error);
            }
        }
    };
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.id = 'eruda';

    document.head.appendChild(script);
};

export const isLocalStorageAvailable = (): boolean => {
    const testKey = 'test_local_storage_key';
    try {
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
};