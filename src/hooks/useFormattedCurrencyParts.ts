import { languageCodeToLocale } from '@/localization/utils';
import { supportsNarrowCurrencyDisplay } from '@/utils';

const formatterCache = new Map<string, Intl.NumberFormat>();
const NARROW_SUPPORTED = supportsNarrowCurrencyDisplay();

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
    const cacheKey = `${languageCodeToLocale(languageCode)}${currency}`;
    if (!formatterCache.has(cacheKey)) {
        formatterCache.set(cacheKey, new Intl.NumberFormat(languageCodeToLocale(languageCode), {
            style: 'currency',
            currencyDisplay: NARROW_SUPPORTED ? 'narrowSymbol' : 'symbol',
            currency: currency,
        }));
    }
    const formatter = formatterCache.get(cacheKey)!;
    const formattedCurrencyParts = formatter.formatToParts(typeof value === 'string' ? parseFloat(value) : value);
    return formattedCurrencyParts;
};