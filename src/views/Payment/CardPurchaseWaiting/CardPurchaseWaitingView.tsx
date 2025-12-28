import { MainLayout } from '@/components/common/MainLayout';
import { TransactionWaiting, TransactionWaitingTexts } from '@/components/Payment/TransactionWaiting';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { isSbpOrder } from '@/states/payment/helpers';
import { usePaymentStore } from '@/states/payment/store';
import { CircleCloseButton } from '@/uikit';
import { openWebviewLink } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './CardPurchaseView.module.scss';

export function CardPurchaseWaitingView() {
    const [t] = useTranslation();
    const purchaseOrder = usePaymentStore(state => state.purchaseOrder);

    const [buttonVisible, setButtonVisible] = useState(false);

    const getTransactionWaitingTexts = (): TransactionWaitingTexts => {
        if (isSbpOrder(purchaseOrder)) {
            return {
                head: t('Card issuance'),
                title: [t('Waiting for payment...')],
                description: t('Checking payment information.<br />This will take a few seconds'),
                button: t('Back to home')
            };
        }

        return {
            head: t('Card issuance'),
            title: [t('Searching for your transaction...'), t('Waiting for confirmation...')],
            description: t('This will take ≈ {{minutes}} min. You can wait or close the window, we will send a notification', { minutes: 5 }),
            button: t('Back to home')
        };
    };

    const navigate = useNavigate();

    const handleCloseWaiting = () => {
        navigate(Routes.HOME);
        usePaymentStore.getState().hidePurchasePaymentWaiting();
    };

    useEffect(() => {
        let timerId = 0;
        if (isSbpOrder(purchaseOrder)) {
            timerId = setTimeout(() => {
                setButtonVisible(true);
            }, 300);
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [purchaseOrder]);

    const handlePay = () => {
        if (isSbpOrder(purchaseOrder)) {
            const link = purchaseOrder.qrLink;
            openWebviewLink(link);
        }
    };

    if (!purchaseOrder) {
        return (<Navigate
            to={Routes.CARD_PURCHASE}
            replace
        />);
    }

    return (
        <MainLayout fullHeight>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: 'var(--safe-area-top)', left: '44px', zIndex: '9999' }}
                onClick={() => usePaymentStore.getState().completeCardPurchase(
                    usePaymentStore.getState().purchaseOrder!.transactionId
                )}
            >Confirm</button>}

            <CircleCloseButton
                className={styles.close}
                onClick={handleCloseWaiting}
            />

            <TransactionWaiting
                texts={getTransactionWaitingTexts()}
                onClose={handleCloseWaiting}
            />

            <TelegramButtons.MainButton
                text={t('Go to payment')}
                visible={buttonVisible}
                onClick={handlePay}
            />
        </MainLayout>
    );
}