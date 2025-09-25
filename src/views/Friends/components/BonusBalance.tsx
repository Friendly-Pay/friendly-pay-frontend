import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useUserStore } from '@/states/user/store';
import classNames from 'classnames';
import styles from './BonusBalance.module.scss';

type BonusBalanceProps = {
    value: number
    currency: string
    className?: string
}

export function BonusBalance({ value, currency, className }: BonusBalanceProps) {
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(value, currency, languageCode);
    return (
        <div className={classNames(styles.root, className)}>
            {formattedCurrencyParts.map((part, index) => (
                <span
                    key={index}
                    className={styles[part.type]}
                >
                    {part.value}
                </span>
            ))}
        </div>
    );
}