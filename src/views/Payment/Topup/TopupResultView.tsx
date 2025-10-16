import { CenteredContent } from '../components/CenteredContent';
import { PaymentIcon } from '../components/PaymentIcon';
import { MainLayout } from '@/components/common/MainLayout';
import { ClockFill } from '@/components/Icons/Clock';
import { TopupBold } from '@/components/Icons/Topup';
import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useBankCard } from '@/states/cards/store';
import { PaymentStatus, usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { Button } from '@/uikit';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TopupResultView.module.scss';

export function TopupResultView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupCurrency = usePaymentTopupCurrency();

    const order = usePaymentStore(state => state.topupOrder!);
    const status = usePaymentStore(state => state.topupStatus);

    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(order.receivedAmount || '0', order.receivedCurrency || undefined, languageCode);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    return (
        <MainLayout>
            <div className={styles.wrap}>
                {Boolean(order.receivedAmount && topupCurrency?.name) && <TopupResult
                    isPending={status === PaymentStatus.Processing}
                    cardNumber={bankCard?.number}
                    cardCurrency={bankCard?.currency}
                    receivedAmount={order.receivedAmount!}
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