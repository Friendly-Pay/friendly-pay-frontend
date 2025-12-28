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
    const bankCardCurrency = useCurrency(bankCard?.currency);
    const topupAmount = useFriendsBonusesStore(state => state.transferAmount);

    const [buttonVisible, setButtonVisible] = useState(false);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        useFriendsBonusesStore.getState().resetWithdraw();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    if (!bankCard || !topupAmount || !bankCardCurrency) {
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
                    currencyId={bankCardCurrency.id}
                    currencyCode={bankCardCurrency.mnemonicCode}
                    currencyImage={bankCardCurrency.image}
                    currencyMinority={bankCardCurrency.minorUnits}
                    receivedAmount={topupAmount}
                    receivedAmountFee={topupAmount}
                    onShowMainButton={() => setButtonVisible(true)}
                />

                <TelegramButtons.MainButton
                    visible={buttonVisible}
                    text={t('Back to home')}
                    onClick={handleContinue}
                />
            </div>
        </MainLayout>
    );
}