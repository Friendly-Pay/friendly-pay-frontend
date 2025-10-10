
import { TxAmount } from './TxAmount';
import { TxIcon } from './TxIcon';
import { TxStatus } from './TxStatus';
import { CardTransaction, CardTransactionType } from '@/states/cards/store';
import { Text } from '@/uikit';
import { formatDateWithLabel } from '@/utils/date';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TransactionItem.module.scss';

type TransactionItemProps = {
    transaction: CardTransaction
    className?: string
    onClick?: () => void
}

// @TODO полный рефактор + подключить картинки
export function TransactionItem({ transaction, className, onClick }: TransactionItemProps) {
    const [t] = useTranslation();

    let title: string = '';
    if (transaction.type === CardTransactionType.DEPOSIT) {
        title = t('Deposit');
    } else if (transaction.type === CardTransactionType.PAYMENT) {
        title = transaction.remark || t('Payment');
    } else if (transaction.type === CardTransactionType.REFUND) {
        title = `${t('Refund')} ${transaction.remark}`;
    } else if (transaction.type === CardTransactionType.VOID) {
        title = `${t('Cancel operation')} ${transaction.remark}`;
    } else if (transaction.type === CardTransactionType.DEPOSIT_BY_REFERRAL) {
        title = `${t('Bonus from friends')}`;
    }

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.iconWrap}>
                <TxIcon
                    size={48}
                    type={transaction.type}
                    logo={transaction.merchantLogo}
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
                        fee={transaction.fee}
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