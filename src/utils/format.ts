import { CURRENCY_SYMBOLS } from '@/states/currency/currency';
import { TOKENS_SYMBOLS } from '@/states/currency/tokens';

export const getCurrencySymbol = (currencyCode: string) => {
    return CURRENCY_SYMBOLS[currencyCode as keyof typeof CURRENCY_SYMBOLS] || TOKENS_SYMBOLS[currencyCode as keyof typeof TOKENS_SYMBOLS];
};

/**
 * Дробит мажорную часть суммы на части по указанному символу
 * @param amount - Сумма для разбивки на части
 * @param partSize - Размер частей суммы. По умолчанию 3
 * @param splitter - Символ, разбивающий части суммы
 * @param splitFrom - Длина суммы, начиная с которой необходимо осуществлять разбивку. По умолчанию 5
 */
const splitAmount = (
    amount: string,
    partSize: number = 3,
    splitter: string,
    splitFrom: number = 5
): string => {
    const splittingRegExp = `\\B(?=(\\d{${partSize}})+(?!\\d))`;

    if (amount.length < splitFrom) {
        return amount;
    }

    return amount.replace(new RegExp(splittingRegExp, 'g'), splitter);
};

const AMOUNT_MAJOR_PART_SIZE = 3;
const AMOUNT_SPLIT_CODE_FROM = 4;

const NEGATIVE_SYMBOLS = {
    'minus-sign': '−',
    'hyphen-minus': '-',
} as const;

/** Тонкий пробел */
export const THINSP = String.fromCharCode(8201);
/** Средний математический пробел */
export const MMSP = String.fromCharCode(8287);

const getCurrencyFormatConfig = (currency: string | undefined, locale: string) => {
    switch (locale) {
        case 'en':
            return {
                thousandsSeparator: ',',
                decimalSeparator: '.',
                currencyPosition: currency && currency in TOKENS_SYMBOLS
                    ? 'suffix' as const
                    : 'prefix' as const
            };
        case 'ru':
        default:
            return {
                thousandsSeparator: MMSP,
                decimalSeparator: ',',
                currencyPosition: 'suffix' as const
            };
    }
};

const getCurrencySeparator = (currencyCode: string | undefined, codeFormat: string, locale: string) => {
    if (!currencyCode) {
        return '';
    }
    if (locale !== 'en' || currencyCode in TOKENS_SYMBOLS) {
        return codeFormat === 'symbolic' ? MMSP : THINSP;
    }
    return '';
};

const getCurrencyCodeWithFormat = (currency: string | undefined, codeFormat: string): string => {
    if (!currency) {
        return '';
    }
    return codeFormat === 'symbolic' ? getCurrencySymbol(currency) : currency;
};

const formatWithCurrency = (value: string, currencyCode: string, separator: string, currencyPosition: 'prefix' | 'suffix'): string => {
    if (currencyPosition === 'prefix') {
        return [currencyCode, value].filter(Boolean).join(separator);
    }
    return [value, currencyCode].filter(Boolean).join(separator);
};

const removeTrailingZeros = (str: string) => str.replace(/0+$/, '');

export const formatAmount = ({
    value,
    currency,
    minority,
    view = 'default',
    negativeSymbol = 'minus-sign',
    codeFormat = 'symbolic',
    locale
}: {
    /** В минорных единицах */
    value: number | null;
    currency?: string;
    minority: number;
    view?: 'default' | 'withMinor';
    negativeSymbol?: 'minus-sign' | 'hyphen-minus';
    codeFormat?: 'symbolic' | 'code';
    locale: string
}) => {
    const config = getCurrencyFormatConfig(currency, locale);
    const currencySymbol = getCurrencyCodeWithFormat(currency, codeFormat);
    const currencySeparator = getCurrencySeparator(currency, codeFormat, locale);

    if (value === null) {
        return {
            majorPart: '',
            minorPart: '',
            formatted: '',
            currencySymbol,
            currencySeparator,
            currencyPosition: config.currencyPosition,
            decimalsSeparator: config.decimalSeparator,
            formattedWithCurrency: formatWithCurrency('', currencySymbol, currencySeparator, config.currencyPosition),
        };
    }

    const actualMinority = minority === 0 ? 1 : minority;
    const fractionDigits = Math.log(actualMinority) * Math.LOG10E;
    const valueAbsStr = (Math.abs(value) / actualMinority).toFixed(fractionDigits);

    const [majorPart, minorPartParsed = ''] = valueAbsStr.split('.');
    let minorPart = minorPartParsed;

    if (view === 'default') {
        if (value % actualMinority === 0) {
            minorPart = '';
        } else {
            // Обрезаем trailing zeros для режима 'default'
            minorPart = removeTrailingZeros(minorPartParsed);
        }
    }

    const majorPartSplitted = splitAmount(majorPart, AMOUNT_MAJOR_PART_SIZE, config.thousandsSeparator, AMOUNT_SPLIT_CODE_FROM);
    const majorPartFormatted = value < 0 ?
        NEGATIVE_SYMBOLS[negativeSymbol] + majorPartSplitted :
        majorPartSplitted;

    const formattedValueStr = minorPart ?
        `${majorPartFormatted}${config.decimalSeparator}${minorPart}` :
        majorPartFormatted;

    return {
        majorPart: majorPartFormatted,
        minorPart,
        currencySymbol,
        formatted: formattedValueStr,
        currencySeparator,
        currencyPosition: config.currencyPosition,
        decimalsSeparator: config.decimalSeparator,
        formattedWithCurrency: formatWithCurrency(formattedValueStr, currencySymbol, currencySeparator, config.currencyPosition),
    };
};

/**
 * Возвращает последние цифры номера счёта в формате `··XXXX`
 * @param accountNumber - Номер счёта
 * @param additionalParams - Дополнительные параметры
 * @param additionalParams.countOfResultDigits - Количество оставляемых цифр. По умолчанию 4
 */
export const cropAccountNumber = (
    accountNumber: string | null | undefined,
    { countOfResultDigits = 4 }: { countOfResultDigits?: number; } = {}
) => {
    if (!accountNumber) {
        return accountNumber;
    }
    return `··${accountNumber.slice(-countOfResultDigits)}`;
};