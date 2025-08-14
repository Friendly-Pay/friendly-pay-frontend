import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { formatCurrency } from '@/utils';
import classNames from 'classnames';
import styles from './BonusBalance.module.scss';

type BonusBalanceProps = {
    value: number
    currency: string
    className?: string
}

export function BonusBalance({ value, currency, className }: BonusBalanceProps) {
    const languageCode = useUserStore(state => state.languageCode);
    return (
        <div className={classNames(styles.root, className)}>
            {formatCurrency(value, currency, safeLanguageCode(languageCode))}
        </div>
    );
}