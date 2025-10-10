import { TxAmount } from './TxAmount';
import { TxIcon } from './TxIcon';
import { TxStatus } from './TxStatus';
import { IbanTransaction, IbanTransactionType } from '@/states/iban/store';
import { Text } from '@/uikit';
import { formatDateWithLabel } from '@/utils/date';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './IbanTransactionItem.module.scss';

type IbanTransactionItemProps = {
    transaction: IbanTransaction
    className?: string
    onClick?: () => void
}

// @TODO полный рефактор + подключить картинки
export function IbanTransactionItem({ transaction, className, onClick }: IbanTransactionItemProps) {
    const [t] = useTranslation();

    let title: string = '';
    if (transaction.type === IbanTransactionType.DEPOSIT) {
        title = t('Deposit');
    } else if (transaction.type === IbanTransactionType.PAYMENT) {
        title = t('Payment');
    }

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.iconWrap}>
                <TxIcon
                    type={transaction.type}
                    className={styles.txIcon}
                />
            </div>

            <div className={styles.content}>
                <div className={styles.data}>
                    <Text
                        type='body'
                        align='left'
                        weight='regular'
                        className={styles.title}
                    >{title}</Text>

                    <TxAmount
                        type={transaction.type}
                        amount={transaction.amount}
                        currency={transaction.currency}
                        status={transaction.status}
                        className={styles.txAmount}
                    />
                </div>
                <div className={styles.data}>
                    <Text
                        type='caption'
                        align='left'
                        weight='regular'
                        className={styles.date}
                    >
                        {formatDateWithLabel(new Date(Number(transaction.createdAt) * 1_000))}
                    </Text>

                    <TxStatus
                        type={transaction.type}
                        status={transaction.status}
                        className={styles.txStatus}
                    />
                </div>
            </div>
        </div>
    );
}