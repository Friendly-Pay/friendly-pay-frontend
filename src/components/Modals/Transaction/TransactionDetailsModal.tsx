import { TxHead } from './TxHead';
import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { PropertyRow } from '@/components/Property/PropertyRow';
import { TxAmount } from '@/components/Transaction/TxAmount';
import { TxIcon } from '@/components/Transaction/TxIcon';
import { languageCodeToLocale } from '@/localization/utils';
import { CardTransactionType, PaymentSystem, useCardsStore, useCurrentBankCard } from '@/states/cards/store';
import { useCurrency } from '@/states/currency/hooks';
import { useUserStore } from '@/states/user/store';
import { Modal, ModalBody, Text } from '@/uikit';
import { formatCardLastFourDigits, formatCurrency } from '@/utils';
import commonUsdt from 'assets/currency/usdt.png';
import { useTranslation } from 'react-i18next';
import styles from './TransactionDetailsModal.module.scss';

export function TransactionDetailsModal() {
    const [t] = useTranslation();
    const isOpen = useCardsStore(state => state.transactionDetailsModal.opened);
    const transaction = useCardsStore(state => state.transactionDetailsModal.data);
    const currentBankCard = useCurrentBankCard();

    const languageCode = useUserStore(state => state.languageCode);
    const locale = languageCodeToLocale(languageCode);

    const originalCurrency = useCurrency(transaction?.originalCurrency);

    // Позже бурать после рефактора
    const originalCurrencyImage = transaction?.originalCurrency.startsWith('USDT')
        ? commonUsdt
        : (originalCurrency?.image || '');


    const getTitle = (): string => {
        if (!transaction) {
            return '';
        }

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
        } else if (transaction.type === CardTransactionType.DEPOSIT_BY_SBP) {
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
                            size={80}
                            type={transaction.type}
                            image={transaction.merchantLogo}
                            currencyImage={originalCurrencyImage}
                            className={styles.icon}
                        />
                        <Text
                            weight='regular'
                            align='center'
                            className={styles.name}
                        >
                            {getTitle()}
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