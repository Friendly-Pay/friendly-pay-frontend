import { BottomFixedContainer } from '@/components/common/BottomFixedContainer';
import { MainLayout } from '@/components/common/MainLayout';
import { DoorOpened } from '@/components/Icons/Door';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TopupCard } from '@/components/Payment/Head/TopupCard';
import { TopupCurrency } from '@/components/Payment/Head/TopupCurrency';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useBankCard } from '@/states/cards/store';
import { useDialogStore } from '@/states/dialog';
import { fetchRate } from '@/states/payment/fetch';
import { PaymentStatus, usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Button, Line, Text } from '@/uikit';
import { formatTokenCurrency } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './TopupView.module.scss';

export function TopupView() {
    const [t] = useTranslation();
    const locale = useUserStore(state => state.languageCode);
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupCurrency = usePaymentTopupCurrency();

    const order = usePaymentStore(state => state.topupOrder);
    const status = usePaymentStore(state => state.topupStatus);

    const navigate = useNavigate();
    const handleCancel = () => {
        useDialogStore.getState().openDialog({
            title: t('Do you want to cancel?'),
            text: t('The top-up will be cancelled.<br/>Do not send funds to this address'),
            icon: <DoorOpened />,
            onConfirm: () => {
                navigate('/');
                usePaymentStore.getState().cancelTopup();
            }
        });
    };

    const handleDone = () => {
        usePaymentStore.getState().userCompleteWaitingTopup();
    };

    const [rate, setRate] = useState(0);

    const rateWithDepositFee = useMemo(() => {
        const depositFee = bankCard?.depositFee || 0;
        return rate * (1 - depositFee / 100);
    }, [rate, bankCard?.depositFee]);

    const minDepositAmount = useMemo(() => {
        if (!bankCard?.minDeposit || !topupCurrency) return 0;

        if (topupCurrency.id === 'GPTON') {
            return formatTokenCurrency(bankCard.minDeposit / rateWithDepositFee, locale, 2);
        } else {
            return bankCard.minDeposit;
        }
    }, [bankCard?.minDeposit, topupCurrency, rateWithDepositFee]);

    useEffect(() => {
        let intervalId: number = 0;
        let mounted = true;

        const loadRates = async () => {
            try {
                const res = await fetchRate();
                if (mounted) {
                    setRate(res.rate);
                }
            } catch (error) {
                if (mounted) {
                    console.error('Failed to fetch rates:', error);
                }
            }
        };

        loadRates();
        intervalId = setInterval(loadRates, 30_000);

        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, []);

    const renderRemark = () => {
        if (!topupCurrency) return;

        if (topupCurrency.id === 'GPTON') {
            return (
                <Text
                    type='captionSmall'
                    align='left'
                    weight='regular'
                    className={styles.caption}
                >
                    {t('Current rate: 1$ = {{amount}} GPTON', { amount: formatTokenCurrency(rateWithDepositFee, locale, 2) })}
                </Text>
            );
        }

        return (
            <Text
                type='captionSmall'
                align='left'
                weight='regular'
                className={styles.caption}
                dangerouslySetInnerHTML={{
                    __html: t('Send only <span>{{topupCurrencyName}} {{topupCurrencyNetwork}}</span>. Do not resend funds to the specified address', {
                        topupCurrencyName: topupCurrency.name,
                        topupCurrencyNetwork: topupCurrency.network
                    })
                }}
            />
        );
    };

    if (!bankCard || !topupCurrency) {
        return <Navigate
            to='/'
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
                <div className={styles.payment}>
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
                        <TopupCurrency
                            name={topupCurrency.name}
                            image={topupCurrency.image}
                            network={topupCurrency.network}
                        />
                    </PaymentHead>

                    <Text
                        type='captionSmall'
                        align='left'
                        weight='regular'
                        className={styles.info}
                        dangerouslySetInnerHTML={{
                            __html: t('Commission <span>{{depositFee}}%</span>, minimum ≈ <span>{{minAmount}}</span>', {
                                depositFee: bankCard.depositFee,
                                minAmount: `${minDepositAmount} ${topupCurrency.id === 'GPTON' ? 'GPTON' : topupCurrency.name}` // @TODO dynamic currency (minDeposit)
                            })
                        }}
                    />
                </div>

                <Text
                    type='title'
                    align='left'
                    weight='medium'
                    className={styles.title}
                >
                    {t('Send')} <span>{topupCurrency.name} {topupCurrency.network}</span><br />
                    {t('to the wallet:')}
                </Text>

                {order
                    ? <PaymentAddress address={order.address} />
                    : <div className={styles.addressPlaceholder}>
                        <Skeleton className={styles.addressSkeleton} />
                        <Skeleton className={styles.qrCodeSkeleton} />
                    </div>}

                {renderRemark()}

                {!(status === PaymentStatus.Idle || status === PaymentStatus.Creating) && <BottomFixedContainer className={styles.buttons}>
                    <Button
                        view='secondary'
                        className={styles.button}
                        onClick={handleCancel}
                    >
                        {t('Cancel')}
                    </Button>
                    <Button
                        view='primary'
                        className={styles.button}
                        onClick={handleDone}
                    >
                        {t('Done')}
                    </Button>
                </BottomFixedContainer>}
            </div>
        </MainLayout>
    );
}