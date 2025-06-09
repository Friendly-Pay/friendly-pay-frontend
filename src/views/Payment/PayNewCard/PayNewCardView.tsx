import { MainLayout } from '@/components/common/MainLayout';
import { Image } from '@/components/Image/Image';
import { FixedBottomLoading } from '@/components/Loading/FixedBottomLoading';
import { CardPrice } from '@/components/Payment/Head/CardPrice';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { PurchaseCard } from '@/components/Payment/Head/PurchaseCard';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { languageCodeToLocale } from '@/localization/utils';
import { useCardsStore } from '@/states/cards/store';
import { PaymentStatus, usePaymentPurchaseCurrency, usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Line, Text } from '@/uikit';
import { formatTokenCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styles from './PayNewCardView.module.scss';

export function PayNewCardView() {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const newCardTypeId = usePaymentStore(state => state.purchaseSelectedCardTypeId!);
    const cardsTypes = useCardsStore(state => state.cardsTypes!);
    const newCardData = cardsTypes[newCardTypeId];
    const purchaseCurrency = usePaymentPurchaseCurrency()!;

    const order = usePaymentStore(state => state.purchaseOrder);
    const status = usePaymentStore(state => state.purchaseStatus);

    if (!purchaseCurrency) {
        return <Navigate
            to='/'
            replace
        />;
    }

    return (
        <MainLayout>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: '0', left: '0' }}
                onClick={() => usePaymentStore.getState().completeCardPurchase(
                    usePaymentStore.getState().purchaseOrder!.transactionId
                )}
            >Confirm</button>}

            <div className={styles.head}>
                <Text
                    type='headline'
                    align='center'
                    weight='semibold'
                >
                    {t('Card payment')}
                </Text>
            </div>

            <div className={styles.content}>
                <div className={styles.payment}>
                    <PaymentHead>
                        <PurchaseCard
                            typeId={newCardData.id}
                            name={newCardData.name}
                            paymentSystem={newCardData.paymentSystem}
                        />
                        <Line />
                        <CardPrice
                            price={newCardData.price}
                            currency='usd'
                        />
                    </PaymentHead>
                </div>

                <Text
                    type='title'
                    align='left'
                    weight='medium'
                    className={styles.title}
                >
                    <div>{t('Send')}</div>
                    {order?.amount
                        ? <div className={styles.payAmount}>
                            <Image src={purchaseCurrency.image} />
                            <span>{formatTokenCurrency(order.amount, languageCodeToLocale(languageCode))}</span> {purchaseCurrency.name} {purchaseCurrency.network}
                        </div>
                        : <Skeleton className={styles.amountSkeleton} />}
                    <div>{t('to the wallet:')}</div>
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
                        __html: t('Send only <span>{{purchaseCurrencyName}} {{purchaseCurrencyNetwork}}</span> to this address. Other assets will be lost', {
                            purchaseCurrencyName: purchaseCurrency.name,
                            purchaseCurrencyNetwork: purchaseCurrency.network
                        })
                    }}
                />

                {status === PaymentStatus.Waiting && <FixedBottomLoading text={t('Waiting for payment...')} />}
            </div>
        </MainLayout >
    );
}