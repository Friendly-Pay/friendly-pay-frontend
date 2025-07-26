import { languageCodeToLocale } from '@/localization/utils';
import { supportsNarrowCurrencyDisplay } from '@/utils';

/**
 * 
 *  `currency`   — символ валюты
 *  `integer`    — целая часть числа
 *  `group`      — разделитель тысяч
 *  `decimal`    — десятичная точка
 *  `fraction`   — дробная часть числа
 *  `plusSign`   — знак "+" (для положительных, если задано)
 *  `minusSign`  — знак "-" (для отрицательных)
 *  `literal`    — прочие символы (например, пробелы или неразрывные пробелы)
 *  `nan`        — "NaN", если значение не-число
 *  `infinity`   — "∞", если значение бесконечность
 */
export const useFormattedCurrencyParts = (value: string | number, currency: string | undefined, languageCode: string) => {
    const formattedCurrencyParts = Intl.NumberFormat(languageCodeToLocale(languageCode), {
        style: 'currency',
        currencyDisplay: supportsNarrowCurrencyDisplay() ? 'narrowSymbol' : 'symbol',
        currency: currency,
    }).formatToParts(typeof value === 'string' ? parseFloat(value) : value);
    return formattedCurrencyParts;
};