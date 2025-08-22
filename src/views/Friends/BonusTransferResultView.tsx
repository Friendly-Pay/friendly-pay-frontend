import { MainLayout } from '@/components/common/MainLayout';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { TopupResult } from '@/components/Payment/TopupResult';
import { useBankCard } from '@/states/cards/store';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './BonusTransferResultView.module.scss';

export function BonusTransferResultView() {
    const [t] = useTranslation();
    const cardId = useFriendsBonusesStore(state => state.transferSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupAmount = useFriendsBonusesStore(state => state.transferAmount);
    const topupCurrency = useFriendsBonusesStore(state => state.balanceCurrency);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        useFriendsBonusesStore.getState().resetWithdraw();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    if (!bankCard || !topupAmount) {
        return <Navigate
            to='/friends/bonus'
            replace
        />;
    }

    return (
        <MainLayout>
            <div className={styles.wrap}>
                <TopupResult
                    isPending
                    cardNumber={bankCard?.number}
                    topupAmount={topupAmount!}
                    topupCurrency={topupCurrency!}
                />

                <TelegramMainButton
                    text={t('Back to home')}
                    onClick={handleContinue}
                />
            </div>
        </MainLayout>
    );
}