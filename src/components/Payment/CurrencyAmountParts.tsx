import { languageCodeToLocale } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { supportsNarrowCurrencyDisplay } from '@/utils';
import styles from './CurrencyAmountParts.module.scss';

type CurrencyAmountPartsProps = {
    value: number | string
    currency?: string
}

export function CurrencyAmountParts({ value, currency }: CurrencyAmountPartsProps) {
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = Intl.NumberFormat(languageCodeToLocale(languageCode), {
        style: currency ? 'currency' : 'decimal',
        currencyDisplay: supportsNarrowCurrencyDisplay() ? 'narrowSymbol' : 'symbol',
        currency: currency,
    }).formatToParts(typeof value === 'string' ? parseFloat(value) : value);

    return (
        <>
            {formattedCurrencyParts.map((part, index) => (
                <span
                    key={index}
                    className={styles[part.type]}
                >
                    {part.value}
                </span>
            ))}
        </>
    );
}