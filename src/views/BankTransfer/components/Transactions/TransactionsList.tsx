import { useBankTransferCurrenciesStore } from '../../state/currencies';
import { useBankTransferRequiredFields } from '../../state/fields';
import { useBankTransferStore } from '../../state/store';
import { BankTransferMethod, BankTransferTransaction, BankTransferTransactionComplianceStatus, BankTransferTransactionStatus } from '../../state/types';
import { TransactionItem } from './TransactionItem';
import { ClockFill } from '@/components/Icons/Clock';
import { useBankTransferPaymentStore } from '@/states/payment/bankTransfer';
import { PaymentStatus } from '@/states/payment/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './TransactionsList.module.scss';

type TransactionsListProps = {
    transactions: BankTransferTransaction[]
    className?: string;
};

export function TransactionsList({ transactions, className }: TransactionsListProps) {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const handleClick = async (transaction: BankTransferTransaction) => {
        // Bank requested extra data
        if (
            transaction.complienceStatus === BankTransferTransactionComplianceStatus.Pending ||
            transaction.complienceStatus === BankTransferTransactionComplianceStatus.Failed
        ) {
            useBankTransferRequiredFields.getState().loadTransactionFields(transaction.id);
            navigate('/bank-transfer/details');
            return;
        }
        if (transaction.status === BankTransferTransactionStatus.WaitingPayment) {
            const { setCurrency, setPayoutAmount, setMethod } = useBankTransferStore.getState();
            const { bankTransferCurrencies, globalBankTransferCurrencies } = useBankTransferCurrenciesStore.getState();

            // Sync store from transaction
            setPayoutAmount(String(transaction.payoutAmount));
            setMethod(transaction.method as BankTransferMethod);

            // Resolve currency object by method + payout currency code
            const pool = transaction.method === BankTransferMethod.BankTransfer
                ? bankTransferCurrencies
                : globalBankTransferCurrencies;
            const found = pool.find(c => c.currency === transaction.payoutCurrency && c.method === transaction.method);
            if (found) setCurrency(found);

            useBankTransferPaymentStore.setState({
                order: {
                    transactionId: transaction.id,
                    sourceAmount: transaction.sourceAmount,
                    walletAddress: transaction.walletAddress,
                },
                paymentStatus: PaymentStatus.Waiting,
            });
            navigate('/payments/bank-transfer');
            return;
        }
    };

    if (!transactions.length) {
        return (
            <div className={classNames(styles.root, className)}>
                <div className={styles.placeholder}>
                    <div className={styles.icon}>
                        <ClockFill />
                    </div>

                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {t('Here will be your transfer history')}
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(styles.root, className)}>
            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => handleClick(transaction)}
                />)
            )}
        </div>
    );
}
