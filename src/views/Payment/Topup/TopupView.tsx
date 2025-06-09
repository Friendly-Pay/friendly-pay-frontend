import { MainLayout } from '@/components/common/MainLayout';
import { FixedBottomLoading } from '@/components/Loading/FixedBottomLoading';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TopupCard } from '@/components/Payment/Head/TopupCard';
import { TopupCurrency } from '@/components/Payment/Head/TopupCurrency';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useCurrentBankCard } from '@/states/cards/store';
import { PaymentStatus, usePaymentStore, usePaymentTopupCurrency } from '@/states/payment/store';
import { Line, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styles from './TopupView.module.scss';

// @TODO добавить мин сумму перевода
export function TopupView() {
    const [t] = useTranslation();
    const bankCard = useCurrentBankCard();
    const topupCurrency = usePaymentTopupCurrency();

    const order = usePaymentStore(state => state.topupOrder);
    const status = usePaymentStore(state => state.topupStatus);

    if (!bankCard || !topupCurrency) {
        return <Navigate
            to='/'
            replace
        />;
    }

    return (
        <MainLayout>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: '0', left: '0' }}
                onClick={() => usePaymentStore.getState().completeTopup(usePaymentStore.getState().topupOrder!.transactionId, 10, 'usd')}
            >Processing</button>}

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
                            __html: t('Commission <span>{{depositFee}}%</span>, crediting ≈ <span>{{processingTime}}</span>', {
                                depositFee: bankCard.depositFee,
                                processingTime: `10 ${t('min')}`
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

                {status === PaymentStatus.Waiting && <FixedBottomLoading text={t('Waiting for top-up...')} />}
            </div>
        </MainLayout>
    );
}