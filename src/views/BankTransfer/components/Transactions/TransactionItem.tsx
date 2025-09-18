import { Bank } from '../Icons/Bank';
import { Globe } from '../Icons/Globe';
import { ClockFill } from '@/components/Icons/Clock';
import { languageCodeToLocale } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { formatDateWithLabel } from '@/utils/date';
import { BankTransferMethod, BankTransferTransaction, BankTransferTransactionComplianceStatus, BankTransferTransactionStatus } from '@/views/BankTransfer/state/types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from '@/components/Transaction/TransactionItem.module.scss';
import amountStyles from '@/components/Transaction/TxAmount.module.scss';
import iconStyles from '@/components/Transaction/TxIcon.module.scss';
import statusStyles from '@/components/Transaction/TxStatus.module.scss';

type TransactionItemProps = {
    transaction: BankTransferTransaction;
    className?: string;
    onClick?: () => void;
};

export function TransactionItem({ transaction, className, onClick }: TransactionItemProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore((s) => s.languageCode);

    const title = transaction.method === BankTransferMethod.GlobalBankTransfer
        ? t('SWIFT Transfer')
        : t('Bank transfer to card');

    const compliance = transaction.complienceStatus;
    const isComplianceFailed = compliance === BankTransferTransactionComplianceStatus.Pending || compliance === BankTransferTransactionComplianceStatus.Failed;

    const isFailed = transaction.status === BankTransferTransactionStatus.Failed || isComplianceFailed;
    const formattedAmount = formatCurrency(
        transaction.payoutAmount,
        transaction.payoutCurrency,
        languageCodeToLocale(languageCode),
        2
    );

    let statusNode: React.ReactNode = null;

    if (isComplianceFailed) {
        statusNode = (
            <Text
                type='caption'
                align='right'
                weight='regular'
                className={classNames(statusStyles.status, statusStyles.danger, styles.txStatus)}
            >
                {t('Bank requires data')}
            </Text>
        );
    } else if (transaction.status === BankTransferTransactionStatus.WaitingPayment) {
        statusNode = (
            <Text
                type='caption'
                align='right'
                weight='regular'
                className={classNames(statusStyles.status, styles.txStatus)}
            >
                <div>{t('Waiting payment')}</div>
            </Text>
        );
    } else if (transaction.status === BankTransferTransactionStatus.InProgress) {
        statusNode = (
            <Text
                type='caption'
                align='right'
                weight='regular'
                className={classNames(statusStyles.status, styles.txStatus)}
            >
                <div className={statusStyles.icon}><ClockFill /></div>
                <div>{t('In progress')}</div>
            </Text>
        );
    } else if (transaction.status === BankTransferTransactionStatus.Failed) {
        statusNode = (
            <Text
                type='caption'
                align='right'
                weight='regular'
                className={classNames(statusStyles.status, statusStyles.danger, styles.txStatus)}
            >
                {t('Error')}
            </Text>
        );
    }

    return (
        <div
            className={classNames(styles.root, className)}
            style={{ cursor: isComplianceFailed || transaction.status === BankTransferTransactionStatus.WaitingPayment ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            <div>
                <div
                    className={classNames(iconStyles.icon, iconStyles.s, styles.txIcon)}
                    style={{
                        backgroundColor: transaction.method === BankTransferMethod.BankTransfer
                            ? 'var(--color-bank-transfer-transaction)'
                            : 'var(--color-bank-transfer-transaction-global)'
                    }}
                >
                    {transaction.method === BankTransferMethod.BankTransfer ? <Bank /> : <Globe />}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.data}>
                    <Text
                        type='body'
                        align='left'
                        weight='regular'
                        className={styles.title}
                    >
                        {title}
                    </Text>

                    <Text
                        type='body'
                        align='right'
                        weight='semibold'
                        className={classNames(amountStyles.amount, styles.txAmount, {
                            [amountStyles.failed]: isFailed,
                        })}
                    >
                        {formattedAmount}
                    </Text>
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

                    {statusNode}
                </div>
            </div>
        </div>
    );
}
