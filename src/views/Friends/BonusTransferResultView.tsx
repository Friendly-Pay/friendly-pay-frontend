import { MainLayout } from '@/components/common/MainLayout';
import { TopupResult } from '@/components/Payment/TopupResult';
import { TelegramButtons } from '@/components/Telegram';
import { useBankCard } from '@/states/cards/store';
import { useCurrency } from '@/states/currency/hooks';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './BonusTransferResultView.module.scss';

export function BonusTransferResultView() {
    const [t] = useTranslation();
    const cardId = useFriendsBonusesStore(state => state.transferSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupAmount = useFriendsBonusesStore(state => state.transferAmount);
    const currency = useCurrency(bankCard?.currency);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        useFriendsBonusesStore.getState().resetWithdraw();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    const [buttonVisible, setButtonVisible] = useState(false);

    if (!bankCard || !topupAmount || !currency) {
        return <Navigate
            to='/friends/bonus'
            replace
        />;
    }

    return (
        <MainLayout>
            <div className={styles.wrap}>
                <TopupResult
                    cardNumber={bankCard.number!}
                    currencyId={currency.id}
                    currencyCode={currency.mnemonicCode}
                    currencyImage={currency.image}
                    currencyMinority={currency.minorUnits}
                    receivedAmount={topupAmount}
                    receivedAmountFee={0}
                    onShowMainButton={() => setButtonVisible(true)}
                />

                <TelegramButtons.MainButton
                    text={t('Back to home')}
                    visible={buttonVisible}
                    onClick={handleContinue}
                />
            </div>
        </MainLayout>
    );
}