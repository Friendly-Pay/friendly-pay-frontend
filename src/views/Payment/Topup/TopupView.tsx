import { usePaymentButtonsVisibility } from '../buttonsContext';
import { CryptoTopup } from './CryptoTopup';
import { SbpTopup } from './SbpTopup';
import { MainLayout } from '@/components/common/MainLayout';
import { Line } from '@/components/Payment/Head/Line';
import { PaymentCurrency, PaymentCurrencyUI } from '@/components/Payment/Head/PaymentCurrency';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TopupCard } from '@/components/Payment/Head/TopupCard';
import { useTimer } from '@/hooks/useTimer';
import { Routes } from '@/routes';
import { useBankCard } from '@/states/cards/store';
import { CurrencyType } from '@/states/currency/hooks';
import { usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { Text } from '@/uikit';
import { ComponentType, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './TopupView.module.scss';

const screens: Record<CurrencyType, ComponentType> = {
    'CRYPTO': CryptoTopup,
    'RUB': SbpTopup
};

export function TopupView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupCurrency = usePaymentTopupCurrency();

    const paymentCurrency: PaymentCurrencyUI | null = useMemo(() => {
        if (!topupCurrency) return null;
        const name = topupCurrency.type === 'CRYPTO' ? `${topupCurrency.name} ${topupCurrency.network}` : topupCurrency.name;
        return {
            name: name,
            image: topupCurrency.image,
            minority: topupCurrency.minorUnits,
            mnemonicCode: topupCurrency.mnemonicCode
        };
    }, [topupCurrency]);

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
            usePaymentStore.getState().openCurrencyModal('TOPUP');
        }, 10);
    };

    const getRemark = () => {
        if (!topupCurrency || !bankCard) {
            return null;
        }

        if (topupCurrency.type === 'CRYPTO') {
            return (
                <Text
                    type='captionSmall'
                    align='left'
                    weight='regular'
                    className={styles.remark}
                    dangerouslySetInnerHTML={{
                        __html: t('Commission <span>{{depositFee}}%</span>, minimum ≈ <span>{{minAmount}}</span>', {
                            depositFee: bankCard.depositFee,
                            minAmount: `${bankCard.minDeposit} ${topupCurrency.name}` // @TODO dynamic currency (minDeposit)
                        })
                    }}
                />
            );
        }

        if (topupCurrency.type === 'RUB') {
            return (
                <Text
                    type='captionSmall'
                    align='left'
                    weight='regular'
                    className={styles.remark}
                >
                    Зачисление моментально
                </Text>
            );
        }
    };

    const CurrentScreen = topupCurrency && screens[topupCurrency.type];

    if (!bankCard) {
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
                    {t('Top-up')}
                </Text>
            </div>

            <div className={styles.content}>
                <div className={classNames(styles.payment, Boolean(topupCurrency?.type === 'CRYPTO') && styles.cryptoPayment)}>
                    <PaymentHead>
                        <TopupCard
                            typeId={bankCard.typeId}
                            virtual={bankCard.isVirtual}
                            balance={bankCard.balance}
                            currency={bankCard.currency}
                            lastFourDigits={bankCard.number!}
                            paymentSystem={bankCard.paymentSystem}
                        />
                        <Line />
                        <PaymentCurrency
                            currency={paymentCurrency}
                            placeholderText={t('Select currency')}
                            labelText={t('Top-up currency')}
                            onClick={handleOpenCurrencyModal}
                        />
                    </PaymentHead>

                    {getRemark()}
                </div>

                {CurrentScreen && <CurrentScreen />}
            </div>
        </MainLayout>
    );
}