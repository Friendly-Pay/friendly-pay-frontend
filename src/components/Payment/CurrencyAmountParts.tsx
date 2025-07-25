import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useUserStore } from '@/states/user/store';
import styles from './CurrencyAmountParts.module.scss';

type CurrencyAmountPartsProps = {
    value: number | string
    currency?: string
}

export function CurrencyAmountParts({ value, currency }: CurrencyAmountPartsProps) {
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(value, currency, languageCode);
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