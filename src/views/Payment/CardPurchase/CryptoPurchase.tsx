import { usePaymentButtonsVisibility } from '../buttonsContext';
import { FormattedAmount } from '@/components/Amount/FormattedAmount';
import { DoorOpened } from '@/components/Icons/Door';
import { Image } from '@/components/Image/Image';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { TelegramButtons } from '@/components/Telegram';
import { useTimer } from '@/hooks/useTimer';
import { Routes } from '@/routes';
import { TokenCurrency } from '@/states/currency/hooks';
import { useDialogStore } from '@/states/dialog';
import { PaymentStatus, PurchaseOrderCrypto, usePaymentPurchaseCurrency, usePaymentStore } from '@/states/payment/store';
import { Text } from '@/uikit';
import { MMSP } from '@/utils/format';
import { toMinorUnits } from '@/utils/math';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './CryptoPurchase.module.scss';

export function CryptoPurchase() {
    const [t] = useTranslation();
    const order = usePaymentStore(state => state.purchaseOrder as PurchaseOrderCrypto);
    const status = usePaymentStore(state => state.purchaseStatus);
    const purchaseCurrency = usePaymentPurchaseCurrency() as TokenCurrency;
    const currencyModalOpened = usePaymentStore(state => state.currencyModal.opened);

    const navigate = useNavigate();
    const { buttonsVisible, showButtons, hideButtons } = usePaymentButtonsVisibility();

    useLayoutEffect(() => {
        if (!currencyModalOpened) {
            showButtons();
        }
    }, [currencyModalOpened]);

    // Перейти к ожиданию
    const handlePaymentDone = () => {
        if (status !== PaymentStatus.ReadyForPayment) {
            return;
        }

        usePaymentStore.getState().openPurchasePaymentWaiting();
    };

    const [startTimer] = useTimer();

    // Отменить
    const handlePaymentCancel = () => {
        hideButtons();

        startTimer(() => useDialogStore.getState().openDialog({
            title: t('Do you want to cancel?'),
            text: t('The top-up will be cancelled.<br/>Do not send funds to this address'),
            icon: <DoorOpened />,
            onConfirm: () => {
                const { cancelCardPurchase, resetCardPurchase } = usePaymentStore.getState();
                navigate(Routes.HOME);
                cancelCardPurchase(order.transactionId);
                resetCardPurchase();
            },
            onCancel: () => {
                showButtons();
            }
        }), 10);
    };

    return (
        <div className={styles.root}>
            <Text
                type='title'
                align='left'
                weight='medium'
                className={styles.title}
            >
                <div>{t('Send')}</div>
                {order?.amount
                    ? <div className={styles.amount}>
                        <Image src={purchaseCurrency.image} />
                        <FormattedAmount
                            value={toMinorUnits(order.amount, purchaseCurrency.minorUnits)}
                            minority={purchaseCurrency.minorUnits}
                            currency={purchaseCurrency.mnemonicCode}
                            className={styles.amountFormatted}
                            majorPartClassName={styles.amountMajorPart}
                            minorPartClassName={styles.amountMinorPart}
                            currencyClassName={styles.amountCurrency}
                            currencySeparatorClassName={styles.amountCurrencySeparator}
                        />{MMSP}<div className={styles.network}>{purchaseCurrency.network}</div>
                        {/* <span>{formatTokenCurrenc(order.amount, languageCodeToLocale(languageCode))}</span> {purchaseCurrency.name} {purchaseCurrency.network} */}
                    </div>
                    : <Skeleton className={styles.amountSkeleton} />}
                <div>{t('to the wallet:')}</div>
            </Text>

            {order
                ? <PaymentAddress address={order.address} />
                : <div className={styles.addressPlaceholder}>
                    <Skeleton className={styles.addressSkeleton} />
                    <Skeleton className={styles.qrCodeSkeleton} />
                </div>}

            <Text
                type='captionSmall'
                align='left'
                weight='regular'
                className={styles.caption}
                dangerouslySetInnerHTML={{
                    __html: t('Send only <span>{{purchaseCurrencyName}} {{purchaseCurrencyNetwork}}</span> to this address.<br/> Other assets will be lost', {
                        purchaseCurrencyName: purchaseCurrency.name,
                        purchaseCurrencyNetwork: purchaseCurrency.network
                    })
                }}
            />

            <TelegramButtons.SecondaryButton
                text={t('Cancel')}
                visible={buttonsVisible}
                onClick={handlePaymentCancel}
            />

            <TelegramButtons.MainButton
                text={t('Done')}
                visible={buttonsVisible}
                onClick={handlePaymentDone}
            />
        </div>
    );
}