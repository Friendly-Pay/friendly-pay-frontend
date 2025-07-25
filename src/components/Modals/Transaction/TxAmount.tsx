import { ClockFill } from '@/components/Icons/Clock';
import { Decline } from '@/components/Icons/Decline';
import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { CardTransactionStatus, CardTransactionType } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TxAmount.module.scss';

type TxAmountProps = {
    type: CardTransactionType,
    fee?: number,
    amount: number,
    currency: string,
    status: CardTransactionStatus,
    className?: string
}

export function TxAmount({ type, fee, amount, currency, status, className }: TxAmountProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);

    let totalAmount = amount;
    if (fee && type === CardTransactionType.PAYMENT) {
        totalAmount += fee;
    }
    let amountSign = '';
    if (type === CardTransactionType.PAYMENT) {
        if (status === CardTransactionStatus.IN_PROGRESS || status === CardTransactionStatus.SUCCESS) {
            amountSign = '-';
        }
    } else if (type === CardTransactionType.DEPOSIT) {
        amountSign = '+';
    }
    const formattedCurrencyParts = useFormattedCurrencyParts(totalAmount, currency, languageCode);

    let statusText: any = null;
    if (status === CardTransactionStatus.IN_PROGRESS) {
        statusText = <Text
            weight='regular'
            className={styles.status}
        ><div className={styles.icon}><ClockFill /></div><div>{t('Operation in progress')}</div></Text>;
    } else if (status === CardTransactionStatus.FAILED) {
        if (type === CardTransactionType.DEPOSIT) {
            statusText = <Text
                weight='regular'
                className={styles.status}
            ><div className={styles.icon}><Decline /></div>{t('Deposit error')}</Text>;
        } else if (type === CardTransactionType.PAYMENT) {
            statusText = <Text
                weight='regular'
                className={styles.status}
            ><div className={styles.icon}><Decline /></div>{t('Operation declined')}</Text>;
        }
    }

    return (
        <div
            className={classNames(styles.root, {
                [styles.success]: type === CardTransactionType.DEPOSIT && (status === CardTransactionStatus.IN_PROGRESS || status === CardTransactionStatus.SUCCESS),
                [styles.danger]: status === CardTransactionStatus.FAILED
            }, className)}
        >
            <Text
                type='headlineLarge'
                align='center'
                weight='semibold'
                className={styles.amount}
            >
                {amountSign}{formattedCurrencyParts.map((part, index) => (
                    <span
                        key={index}
                        className={styles[part.type]}
                    >
                        {part.value}
                    </span>
                ))}
            </Text>

            {statusText}
        </div>
    );
}