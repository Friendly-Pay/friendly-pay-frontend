
import { TxAmount } from './TxAmount';
import { TxIcon } from './TxIcon';
import { TxStatus } from './TxStatus';
import { CardTransaction, CardTransactionType } from '@/states/cards/store';
import { useCurrency } from '@/states/currency/hooks';
import { Text } from '@/uikit';
import { formatDateWithLabel } from '@/utils/date';
import commonUsdt from 'assets/currency/usdt.png';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TransactionItem.module.scss';

type TransactionItemProps = {
    transaction: CardTransaction
    className?: string
    onClick?: () => void
}

// @TODO полный рефактор
export function TransactionItem({ transaction, className, onClick }: TransactionItemProps) {
    const [t] = useTranslation();
    const originalCurrency = useCurrency(transaction.originalCurrency);

    // Позже бурать после рефактора
    const originalCurrencyImage = transaction.originalCurrency.startsWith('USDT')
        ? commonUsdt
        : (originalCurrency?.image || '');

    const getTitle = (): string => {
        switch (transaction.type) {
            case CardTransactionType.DEPOSIT:
                if (originalCurrency) {
                    const network = 'network' in originalCurrency ? ` ${originalCurrency.network}` : '';
                    return `${t('Deposit')}. ${originalCurrency.name} ${network}`;
                }
                return t('Deposit');

            case CardTransactionType.DEPOSIT_BY_SBP:
                return `${t('Deposit')}. ${t('SBP Rubles')}`;

            case CardTransactionType.PAYMENT:
                return transaction.remark || t('Payment');

            case CardTransactionType.REFUND:
                return transaction.remark
                    ? `${t('Refund')} ${transaction.remark}`
                    : t('Refund');

            case CardTransactionType.VOID:
                return transaction.remark
                    ? `${t('Cancel operation')} ${transaction.remark}`
                    : t('Cancel operation');

            case CardTransactionType.DEPOSIT_BY_REFERRAL:
                return t('Bonus from friends');

            default:
                return '';
        }
    };

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.iconWrap}>
                <TxIcon
                    size={48}
                    type={transaction.type}
                    image={transaction.merchantLogo}
                    currencyImage={originalCurrencyImage}
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
                    >{getTitle()}</Text>

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