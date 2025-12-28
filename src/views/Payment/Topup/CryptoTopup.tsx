import { usePaymentButtonsVisibility } from '../buttonsContext';
import { DoorOpened } from '@/components/Icons/Door';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { TelegramButtons } from '@/components/Telegram';
import { useTimer } from '@/hooks/useTimer';
import { Routes } from '@/routes';
import { TokenCurrency } from '@/states/currency/hooks';
import { useDialogStore } from '@/states/dialog';
import { PaymentStatus, TopupOrderCrypto, usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { Text } from '@/uikit';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './CryptoTopup.module.scss';

export function CryptoTopup() {
    const [t] = useTranslation();
    const order = usePaymentStore(state => state.topupOrder as TopupOrderCrypto);
    const status = usePaymentStore(state => state.topupStatus);
    const topupCurrency = usePaymentTopupCurrency() as TokenCurrency;
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

        usePaymentStore.getState().openCryptoTopupPaymentWaiting();
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
                const { cancelTopup, resetTopup } = usePaymentStore.getState();
                navigate(Routes.HOME);
                cancelTopup(order.transactionId);
                resetTopup();
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
                {t('Send')} <span>{topupCurrency.name} {topupCurrency.network}</span><br />
                {t('to the wallet:')}
            </Text>

            {order && status === PaymentStatus.ReadyForPayment
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
                    __html: t('Send only <span>{{topupCurrencyName}} {{topupCurrencyNetwork}}</span>. Do not resend funds to the specified address', {
                        topupCurrencyName: topupCurrency.name,
                        topupCurrencyNetwork: topupCurrency.network
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