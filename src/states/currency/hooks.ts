import { CURRENCY } from './currency';
import { TOKENS } from './tokens';

export type TokenCurrency = typeof TOKENS[keyof typeof TOKENS];

export type RubCurrency = typeof CURRENCY['RUB'];

export type CurrencyType = TokenCurrency['type'] | RubCurrency['type'];

export const useCurrency = (currencyCode?: string | null) => {
    if (currencyCode) {
        if (currencyCode in TOKENS) {
            return TOKENS[currencyCode as keyof typeof TOKENS];
        }
        if (currencyCode in CURRENCY) {
            return CURRENCY[currencyCode as keyof typeof CURRENCY];
        }
    }
    return null;
};