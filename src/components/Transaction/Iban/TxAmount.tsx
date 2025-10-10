import { languageCodeToLocale } from '@/localization/utils';
import { IbanTransactionStatus, IbanTransactionType } from '@/states/iban/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import classNames from 'classnames';
import styles from './TxAmount.module.scss';

type TxAmountProps = {
    type: IbanTransactionType,
    fee?: number,
    amount: number
    currency: string,
    status: IbanTransactionStatus,
    className?: string
}

export function TxAmount({ type, fee, amount, currency, status, className }: TxAmountProps) {
    const languageCode = useUserStore(state => state.languageCode);

    let totalAmount = amount;
    if (typeof fee === 'number') {
        if (type === IbanTransactionType.PAYMENT) {
            totalAmount += fee;
        }
    }

    const isTopup = type === IbanTransactionType.DEPOSIT;

    return (
        <Text
            type='body'
            align='right'
            weight='semibold'
            className={classNames(styles.amount, {
                [styles.topup]: isTopup,
                [styles.failed]: status === 'FAILED'
            }, className)}
        >
            {isTopup && '+'}{formatCurrency(totalAmount, currency, languageCodeToLocale(languageCode), 2)}
        </Text>
    );
}