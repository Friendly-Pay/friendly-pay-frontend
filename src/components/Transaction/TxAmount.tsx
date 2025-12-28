import { languageCodeToLocale } from '@/localization/utils';
import { CardTransactionStatus, CardTransactionType } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import cn from 'classnames';
import styles from './TxAmount.module.scss';

type TxAmountProps = {
    type: CardTransactionType,
    fee?: number,
    amount: number
    currency: string,
    status: CardTransactionStatus,
    className?: string
}

const feeHandlers: Record<CardTransactionType, (amount: number, fee?: number) => number> = {
    [CardTransactionType.PAYMENT]: (amount, fee) => fee ? amount + fee : amount,
    [CardTransactionType.REFUND]: (amount, fee) => fee ? amount - fee : amount,
    [CardTransactionType.VOID]: (amount, fee) => fee ? amount - fee : amount,
    [CardTransactionType.DEPOSIT]: (amount, _fee) => amount,
    [CardTransactionType.DEPOSIT_BY_SBP]: (amount, _fee) => amount,
    [CardTransactionType.DEPOSIT_BY_REFERRAL]: (amount, _fee) => amount,
};

const POSITIVE_TRANSACTION_TYPES = new Set<CardTransactionType>([
    CardTransactionType.DEPOSIT,
    CardTransactionType.REFUND,
    CardTransactionType.VOID,
    CardTransactionType.DEPOSIT_BY_REFERRAL,
    CardTransactionType.DEPOSIT_BY_SBP,
]);

export function TxAmount({ type, fee, amount, currency, status, className }: TxAmountProps) {
    const languageCode = useUserStore(state => state.languageCode);

    const feeHandler = feeHandlers[type] || ((amount) => amount);
    const totalAmount = feeHandler(amount, fee);

    const isPositive = POSITIVE_TRANSACTION_TYPES.has(type);
    const isNegative = status === CardTransactionStatus.FAILED;

    const locale = languageCodeToLocale(languageCode);
    const formattedAmount = formatCurrency(totalAmount, currency, locale, 2);

    const sign = isPositive ? '+' : '';
    const componentClasses = cn(
        styles.amount,
        {
            [styles.positive]: isPositive && !isNegative,
            [styles.negative]: isNegative,
        },
        className
    );

    return (
        <Text
            type='body'
            align='right'
            weight='semibold'
            className={componentClasses}
        >
            {sign}{formattedAmount}
        </Text>
    );
}