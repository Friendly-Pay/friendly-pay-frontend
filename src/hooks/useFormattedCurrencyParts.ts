import { languageCodeToLocale } from '@/localization/utils';
import { supportsNarrowCurrencyDisplay } from '@/utils';

const formatterCache = new Map<string, Intl.NumberFormat>();
const NARROW_SUPPORTED = supportsNarrowCurrencyDisplay();

/** @deprecated */
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