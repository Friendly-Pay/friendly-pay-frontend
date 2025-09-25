import { TxAmount } from './TxAmount';
import { TxHead } from './TxHead';
import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { PropertyRow } from '@/components/Property/PropertyRow';
import { TxIcon } from '@/components/Transaction/TxIcon';
import { languageCodeToLocale } from '@/localization/utils';
import { CardTransactionType, PaymentSystem, useCardsStore, useCurrentBankCard } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Modal, ModalBody, Text } from '@/uikit';
import { formatCardLastFourDigits, formatCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './TransactionDetailsModal.module.scss';

export function TransactionDetailsModal() {
    const [t] = useTranslation();
    const isOpen = useCardsStore(state => state.transactionDetailsModal.opened);
    const transaction = useCardsStore(state => state.transactionDetailsModal.data);
    const currentBankCard = useCurrentBankCard();

    const languageCode = useUserStore(state => state.languageCode);
    const locale = languageCodeToLocale(languageCode);

    let name: string = '';
    if (transaction) {
        if (transaction.type === CardTransactionType.DEPOSIT) {
            name = t('Deposit');
        } else if (transaction.type === CardTransactionType.PAYMENT) {
            name = transaction.remark || t('Payment');
        } else if (transaction.type === CardTransactionType.REFUND) {
            name = `${t('Refund')} ${transaction.remark}`;
        } else if (transaction.type === CardTransactionType.VOID) {
            name = `${t('Cancel operation')} ${transaction.remark}`;
        } else if (transaction.type === CardTransactionType.DEPOSIT_BY_REFERRAL) {
            name = `${t('Bonus from friends')}`;
        }
    }

    let cardLabel = t('Account');
    if (transaction) {
        if (transaction.type === CardTransactionType.REFUND || transaction.type === CardTransactionType.VOID) {
            cardLabel = t('Refund to account');
        }
    }

    let exchangeRate: string = '';
    if (transaction) {
        const { amount, originalAmount, currency, originalCurrency } = transaction;
        const rate = originalAmount / amount;
        exchangeRate = `1 ${currency} = ${formatCurrency(rate, originalCurrency, locale, 2)} ${originalCurrency}`;
    }

    let transactionAmount: string = '';
    if (transaction) {
        if (transaction.type === CardTransactionType.DEPOSIT || transaction.type === CardTransactionType.DEPOSIT_BY_REFERRAL) {
            const total = transaction.amount + transaction.fee;
            transactionAmount = `${formatCurrency(total, transaction.currency, locale, 2)}`;
        } else if (transaction.type === CardTransactionType.PAYMENT || transaction.type === CardTransactionType.REFUND || transaction.type === CardTransactionType.VOID) {
            transactionAmount = `${formatCurrency(transaction.originalAmount, transaction.originalCurrency, locale, 2)}`;
        }
    }

    let cardPaymentSystem: string = '';
    if (transaction && currentBankCard) {
        switch (currentBankCard.paymentSystem) {
            case PaymentSystem.Visa:
                cardPaymentSystem = 'Visa';
                break;

            case PaymentSystem.Mastercard:
                cardPaymentSystem = 'MasterCard';
                break;
        }
    }

    const onClose = () => {
        useCardsStore.getState().closeTransactionDetails();
    };

    const onAnimationCompleted = () => {
        const { resetTransactionDetails, transactionDetailsModal } = useCardsStore.getState();
        if (!transactionDetailsModal.opened) {
            resetTransactionDetails();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            fullscreen
            padding={false}
            onAnimationCompleted={onAnimationCompleted}
        >
            {transaction && <>
                <TxHead createdAt={transaction.createdAt} />
                <ModalBody className={styles.body}>
                    <div className={styles.data}>
                        <TxIcon
                            size='m'
                            type={transaction.type}
                            className={styles.icon}
                        />
                        <Text
                            weight='regular'
                            align='center'
                            className={styles.name}
                        >
                            {name}
                        </Text>
                        <TxAmount
                            type={transaction.type}
                            fee={transaction.fee}
                            amount={transaction.amount}
                            currency={transaction.currency}
                            status={transaction.status}
                            className={styles.txAmount}
                        />
                    </div>
                    <div className={styles.list}>
                        {!!currentBankCard && <PropertyRow
                            label={cardLabel}
                            value={<div className={styles.bankAccount}>
                                {cardPaymentSystem} <span>{formatCardLastFourDigits(currentBankCard.number!)}</span>
                            </div>}
                        >
                            <BankCardPreview
                                typeId={currentBankCard.typeId}
                                virtual={currentBankCard.isVirtual}
                                paymentSystem={currentBankCard.paymentSystem}
                                className={styles.cardPreview}
                            />
                        </PropertyRow>}
                        <PropertyRow
                            label={t('Transaction amount')}
                            value={transactionAmount}
                        />
                        <PropertyRow
                            label={t('Exchange rate')}
                            value={exchangeRate}
                        />
                        <PropertyRow
                            label={t('Fee')}
                            value={formatCurrency(transaction.fee, transaction.currency, locale)}
                        />
                    </div>
                </ModalBody>
            </>}
        </Modal>
    );
}