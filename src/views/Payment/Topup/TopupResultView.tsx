import { MainLayout } from '@/components/common/MainLayout';
import { TopupResult } from '@/components/Payment/TopupResult';
import { useBankCard } from '@/states/cards/store';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { Button } from '@/uikit';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TopupResultView.module.scss';

export function TopupResultView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);

    const order = usePaymentStore(state => state.topupOrder!);
    const status = usePaymentStore(state => state.topupStatus);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    return (
        <MainLayout fullHeight>
            <div className={styles.wrap}>
                {Boolean(order.receivedAmount && order.receivedCurrency) && <TopupResult
                    isPending={status === PaymentStatus.Processing}
                    cardNumber={bankCard?.number}
                    topupAmount={order.receivedAmount!}
                    topupCurrency={order.receivedCurrency!}
                />}

                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleContinue}
                >
                    {t('Back to home')}
                </Button>
            </div>
        </MainLayout>
    );
}