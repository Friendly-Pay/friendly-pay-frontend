import { usePaymentButtonsVisibility } from '../buttonsContext';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { PaymentStatus, PurchaseOrderSbp, usePaymentStore } from '@/states/payment/store';
import { openWebviewLink } from '@/utils';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function SbpPurchase() {
    const [t] = useTranslation();
    const purchaseStatus = usePaymentStore(state => state.purchaseStatus);
    const currencyModalOpened = usePaymentStore(state => state.currencyModal.opened);

    const { buttonsVisible, showButtons } = usePaymentButtonsVisibility();

    useLayoutEffect(() => {
        if (!currencyModalOpened) {
            showButtons();
        }
    }, [currencyModalOpened]);

    const handlePay = async () => {
        if (purchaseStatus !== PaymentStatus.ReadyForPayment) {
            return;
        }
        const { purchaseOrder, openPurchasePaymentWaiting } = usePaymentStore.getState();
        const paymentUrl = (purchaseOrder as PurchaseOrderSbp).qrLink;

        openWebviewLink(paymentUrl);
        openPurchasePaymentWaiting();
    };

    const navigate = useNavigate();

    const handleCancel = () => {
        if (purchaseStatus !== PaymentStatus.ReadyForPayment) {
            return;
        }

        const { purchaseOrder, cancelCardPurchase, resetCardPurchase } = usePaymentStore.getState();
        navigate(Routes.HOME);
        if (purchaseOrder) {
            cancelCardPurchase(purchaseOrder.transactionId);
        }
        resetCardPurchase();
    };

    return (
        <>
            <TelegramButtons.SecondaryButton
                text={t('Cancel')}
                visible={buttonsVisible}
                onClick={handleCancel}
            />

            <TelegramButtons.MainButton
                text={t('Pay')}
                visible={Boolean(buttonsVisible)}
                onClick={handlePay}
            />
        </>
    );
}