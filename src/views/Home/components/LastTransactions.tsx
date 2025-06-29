import { TransactionItem } from '@/components/Transaction/TransactionItem';
import { CardTransaction, useCardsStore } from '@/states/cards/store';
import { Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import transactionsPlaceholder from 'assets/transactions_placeholder.png?inline';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './LastTransactions.module.scss';

type LastTransactionsProps = {
    list: CardTransaction[]
    lastFourDigits?: string,
    className?: string
}

export function LastTransactions({ list, lastFourDigits, className }: LastTransactionsProps) {
    const [t] = useTranslation();
    const openTransactionDetails = useCardsStore(state => state.openTransactionDetails);

    let content: any = null;
    if (list.length) {
        content = <div className={classNames(styles.list, className)}>
            {list.map((transaction) => <TransactionItem
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                currency={transaction.currency}
                createdAt={transaction.createdAt}
                status={transaction.status}
                onClick={() => openTransactionDetails(transaction)}
            />)}
        </div>;
    } else {
        content = <div className={classNames(styles.placeholder, className)}>
            <img
                src={transactionsPlaceholder}
                alt='history'
            />

            <Text
                type='body'
                align='center'
                className={styles.text}
            >
                {t('Your card transactions will appear here')}  {lastFourDigits && <span>{formatCardLastFourDigits(lastFourDigits)}</span>}
            </Text>
        </div>;
    }

    return (
        <div className={styles.root}>
            <div className={styles.head}>
                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                >
                    {t('Last transactions')}
                </Text>
            </div>

            {content}
        </div>
    );
}