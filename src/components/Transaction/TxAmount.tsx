import { languageCodeToLocale } from '@/localization/utils';
import { CardTransactionStatus, CardTransactionType } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import classNames from 'classnames';
import styles from './TxAmount.module.scss';

type TxAmountProps = {
    type: CardTransactionType,
    fee?: number,
    amount: number
    currency: string,
    status: CardTransactionStatus,
    className?: string
}

export function TxAmount({ type, fee, amount, currency, status, className }: TxAmountProps) {
    const languageCode = useUserStore(state => state.languageCode);

    let totalAmount = amount;
    if (fee && type === CardTransactionType.PAYMENT) {
        totalAmount += fee;
    }

    return (
        <Text
            type='body'
            align='right'
            weight='semibold'
            className={classNames(styles.amount, {
                [styles.deposit]: type === CardTransactionType.DEPOSIT,
                [styles.failed]: status === CardTransactionStatus.FAILED
            }, className)}
        >
            {type === CardTransactionType.DEPOSIT && '+'}{formatCurrency(totalAmount, currency, languageCodeToLocale(languageCode), 2)}
        </Text>
    );
}