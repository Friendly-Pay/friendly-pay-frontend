import { usePaymentButtonsVisibility } from '../buttonsContext';
import { CryptoPurchase } from './CryptoPurchase';
import { ExitButton } from './ExitButton';
import { SbpPurchase } from './SbpPurchase';
import { MainLayout } from '@/components/common/MainLayout';
import { PaymentCurrency, PaymentCurrencyUI } from '@/components/Payment/Head/PaymentCurrency';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { PurchaseCard } from '@/components/Payment/Head/PurchaseCard';
import { useTimer } from '@/hooks/useTimer';
import { Routes } from '@/routes';
import { useCardsStore } from '@/states/cards/store';
import { CurrencyType } from '@/states/currency/hooks';
import { usePaymentPurchaseCurrency, usePaymentStore } from '@/states/payment/store';
import { Line, Text } from '@/uikit';
import { ComponentType, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styles from './CardPurchaseView.module.scss';

const screens: Record<CurrencyType, ComponentType> = {
    'CRYPTO': CryptoPurchase,
    'RUB': SbpPurchase
};

export function CardPurchaseView() {
    const [t] = useTranslation();
    const cardTypeId = usePaymentStore(state => state.purchaseSelectedCardTypeId);
    const cardTypeData = useCardsStore(state => cardTypeId ? state.cardsTypes![cardTypeId] : null);
    const purchaseAmount = usePaymentStore(state => state.purchaseOrder ? state.purchaseOrder.amount : null);
    const purchaseCurrency = usePaymentPurchaseCurrency();

    const paymentCurrency: PaymentCurrencyUI | null = useMemo(() => {
        if (!purchaseCurrency) return null;
        const name = purchaseCurrency.type === 'CRYPTO' ? `${purchaseCurrency.name} ${purchaseCurrency.network}` : purchaseCurrency.name;
        return {
            name: name,
            image: purchaseCurrency.image,
            minority: purchaseCurrency.minorUnits,
            mnemonicCode: purchaseCurrency.mnemonicCode
        };
    }, [purchaseCurrency]);

    const { hideButtons } = usePaymentButtonsVisibility();

    useEffect(() => {
        return () => {
            hideButtons();
        };
    }, []);

    const [startTimer] = useTimer();

    const handleOpenCurrencyModal = () => {
        hideButtons();
        startTimer(() => {
            usePaymentStore.getState().openCurrencyModal('CARD_PURCHASE');
        }, 10);
    };

    const getRemark = () => {
        if (purchaseCurrency) {
            if (purchaseCurrency.type === 'RUB') {
                return (
                    <Text
                        type='captionSmall'
                        align='left'
                        weight='regular'
                        className={styles.remark}
                    >
                        {t('Card issuance is instant')}
                    </Text>
                );
            }
        }
    };

    const CurrentScreen = purchaseCurrency && screens[purchaseCurrency.type];

    if (!cardTypeData) {
        return <Navigate
            to={Routes.HOME}
            replace
        />;
    }

    return (
        <MainLayout>
            <div className={styles.head}>
                <Text
                    type='headline'
                    align='center'
                    weight='semibold'
                >
                    {t('Pay for the card and it’s yours')}
                </Text>
            </div>

            <div className={styles.content}>
                <div className={styles.payment}>
                    <PaymentHead>
                        <PurchaseCard
                            typeId={cardTypeData.id}
                            name={cardTypeData.name}
                            paymentSystem={cardTypeData.paymentSystem}
                        />
                        <Line />
                        <PaymentCurrency
                            currency={paymentCurrency}
                            amount={purchaseAmount}
                            placeholderText={t('Select currency')}
                            labelText={t('Cost')}
                            onClick={handleOpenCurrencyModal}
                        />
                    </PaymentHead>

                    {getRemark()}
                </div>

                {CurrentScreen
                    ? (
                        <CurrentScreen />
                    )
                    : (
                        <ExitButton />
                    )}
            </div>
        </MainLayout>
    );
}