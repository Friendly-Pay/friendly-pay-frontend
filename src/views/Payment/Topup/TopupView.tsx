import { BottomFixedContainer } from '@/components/common/BottomFixedContainer';
import { MainLayout } from '@/components/common/MainLayout';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TopupCard } from '@/components/Payment/Head/TopupCard';
import { TopupCurrency } from '@/components/Payment/Head/TopupCurrency';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useBankCard } from '@/states/cards/store';
import { PaymentStatus, usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { Button, Line, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './TopupView.module.scss';

export function TopupView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);
    const topupCurrency = usePaymentTopupCurrency();

    const order = usePaymentStore(state => state.topupOrder);
    const status = usePaymentStore(state => state.topupStatus);

    const navigate = useNavigate();
    const handleCancel = () => {
        navigate('/');
        usePaymentStore.getState().cancelTopup();
    };

    const handleDone = () => {
        usePaymentStore.getState().userCompleteWaitingTopup();
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

                    {/* @TODO время пополнения */}
                    <Text
                        type='captionSmall'
                        align='left'
                        weight='regular'
                        className={styles.info}
                        dangerouslySetInnerHTML={{
                            __html: t('Commission <span>{{depositFee}}%</span>, minimum ≈ <span>{{minAmount}}</span>', {
                                depositFee: bankCard.depositFee,
                                minAmount: '25$' // @TODO
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
                    {t('Send')} <span>USDT TRC20</span><br />
                    {t('to the wallet:')}
                </Text>

                {order
                    ? <PaymentAddress address={order.address} />
                    : <div className={styles.addressPlaceholder}>
                        <Skeleton className={styles.addressSkeleton} />
                        <Skeleton className={styles.qrCodeSkeleton} />
                    </div>}

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