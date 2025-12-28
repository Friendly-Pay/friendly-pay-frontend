import { MainLayout } from '@/components/common/MainLayout';
import { TransactionWaiting, TransactionWaitingTexts } from '@/components/Payment/TransactionWaiting';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { useBankCard } from '@/states/cards/store';
import { isSbpOrder } from '@/states/payment/helpers';
import { usePaymentStore } from '@/states/payment/store';
import { CircleCloseButton } from '@/uikit';
import { formatCardLastFourDigits, openWebviewLink } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './TopupWaitingView.module.scss';

export function TopupWaitingView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupOrder = usePaymentStore(state => state.topupOrder);

    const [buttonVisible, setButtonVisible] = useState(false);

    const getTransactionWaitingTexts = (): TransactionWaitingTexts => {
        const head = bankCard?.number
            ? t('Top-up <span>{{cardNumber}}</span>', { cardNumber: formatCardLastFourDigits(bankCard.number) })
            : '';

        if (isSbpOrder(topupOrder)) {
            return {
                head: head,
                title: [t('Waiting for payment...')],
                description: t('Checking payment information.<br />This will take a few seconds'),
                button: t('Back to home')
            };
        }

        return {
            head: head,
            title: [t('Searching for your transaction...'), t('Waiting for confirmation...')],
            description: t('This will take ≈ {{minutes}} min. You can wait or close the window, we will send a notification', { minutes: 5 }),
            button: t('Back to home')
        };
    };

    const navigate = useNavigate();

    const handleCloseWaiting = () => {
        navigate(Routes.HOME);
        usePaymentStore.getState().hideTopupPaymentWaiting();
    };

    useEffect(() => {
        let timerId = 0;
        if (isSbpOrder(topupOrder)) {
            timerId = setTimeout(() => {
                setButtonVisible(true);
            }, 300);
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [topupOrder]);

    const handlePay = () => {
        if (isSbpOrder(topupOrder)) {
            const link = topupOrder.qrLink;
            openWebviewLink(link);
        }
    };

    if (!bankCard || (!topupOrder)) {
        return (<Navigate
            to={Routes.TOPUP}
            replace
        />);
    }

    return (
        <MainLayout fullHeight>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: 'var(--safe-area-top)', left: '44px', zIndex: '9999' }}
                onClick={() => usePaymentStore.getState().completeTopup(
                    usePaymentStore.getState().topupOrder!.transactionId, 1000, 100
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