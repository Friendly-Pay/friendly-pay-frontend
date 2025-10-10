import { IbanTransactionItem } from '@/components/Transaction/Iban/IbanTransactionItem';
import { useIbanStore } from '@/states/iban/store';
import { Text } from '@/uikit';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TransactionsList.module.scss';

type TransactionsListProps = {
    className?: string
}

export function TransactionsList({ className }: TransactionsListProps) {
    const [t] = useTranslation();
    const transactions = useIbanStore(state => state.transactions);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const prevTransactionsRef = useRef<any[]>([]);
    const isFirstRenderRef = useRef(true);
    const timerRef = useRef<any>();

    useEffect(() => {
        const prevTransactions = prevTransactionsRef.current;

        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            if (transactions.length > 0) {
                setShowContent(true);
                setShouldAnimate(false);
            }
        } else {
            if (prevTransactions.length === 0 && transactions.length > 0) {
                setShouldAnimate(true);
                timerRef.current = setTimeout(() => {
                    setShowContent(true);
                }, 300);
            }
        }

        prevTransactionsRef.current = transactions;
    }, [transactions]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


    if (!showContent) {
        return null;
    }

    return (
        <div className={classNames(styles.root, className)}>
            <Text
                type='title'
                align='left'
                weight='semibold'
                className={styles.title}
            >
                {t('Transaction history')}
            </Text>
            <AnimatePresence>
                {shouldAnimate ? (
                    <motion.div
                        initial={{ opacity: 0, }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {transactions.map(transaction => (
                            <IbanTransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                className={styles.item}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div>
                        {transactions.map(transaction => (
                            <IbanTransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                className={styles.item}
                            />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}