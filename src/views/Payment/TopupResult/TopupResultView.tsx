import { MainLayout } from '@/components/common/MainLayout';
import { TopupResult } from '@/components/Payment/TopupResult';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { useBankCard } from '@/states/cards/store';
import { isCryptoOrder, isSbpOrder } from '@/states/payment/helpers';
import { usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { CircleCloseButton } from '@/uikit';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './TopupResultView.module.scss';

export function TopupResultView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId)!;
    const topupOrder = usePaymentStore(state => state.topupOrder);
    const topupCurrency = usePaymentTopupCurrency();

    let paymentAmount: number | null;
    let paymentAmountFee: number | null;
    if (isSbpOrder(topupOrder)) {
        paymentAmount = topupOrder.amount;
        paymentAmountFee = topupOrder.fee;
    } else if (isCryptoOrder(topupOrder)) {
        paymentAmount = topupOrder.receivedAmount;
        paymentAmountFee = topupOrder.receivedAmountFee;
    } else {
        paymentAmount = null;
        paymentAmountFee = null;
    }

    const [buttonVisible, setButtonVisible] = useState(false);

    const navigate = useNavigate();

    const handleContinue = useCallback(() => {
        navigate(Routes.HOME);
        usePaymentStore.getState().resetTopup();
    }, [navigate]);

    if (!bankCard || !topupCurrency || !paymentAmount) {
        return (<Navigate
            to={Routes.TOPUP}
            replace
        />);
    }

    return (
        <MainLayout
            fullHeight
            className={styles.layout}
        >
            <CircleCloseButton
                className={styles.close}
                onClick={handleContinue}
            />

            <TopupResult
                cardNumber={bankCard.number!}
                currencyId={topupCurrency.id}
                currencyCode={topupCurrency.mnemonicCode}
                currencyImage={topupCurrency.image}
                currencyMinority={topupCurrency.minorUnits}
                receivedAmount={paymentAmount}
                receivedAmountFee={paymentAmountFee}
                onShowMainButton={() => setButtonVisible(true)}
            />

            <TelegramButtons.MainButton
                text={t('Done')}
                visible={buttonVisible}
                onClick={handleContinue}
            />
        </MainLayout>
    );
}