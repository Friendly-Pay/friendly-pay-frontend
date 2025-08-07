import { BottomFixedContainer } from '@/components/common/BottomFixedContainer';
import { MainLayout } from '@/components/common/MainLayout';
import { DoorOpened } from '@/components/Icons/Door';
import { Image } from '@/components/Image/Image';
import { CardPrice } from '@/components/Payment/Head/CardPrice';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { PurchaseCard } from '@/components/Payment/Head/PurchaseCard';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { languageCodeToLocale } from '@/localization/utils';
import { useCardsStore } from '@/states/cards/store';
import { useDialogStore } from '@/states/dialog';
import { PaymentStatus, usePaymentPurchaseCurrency, usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Button, Line, Text } from '@/uikit';
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

    const handleCancel = () => {
        useDialogStore.getState().openDialog({
            title: t('Do you want to cancel?'),
            text: t('The purchase will be cancelled.<br/>Do not send funds to this address'),
            icon: <DoorOpened />,
            onConfirm: () => {
                usePaymentStore.getState().cancelCardPurchase();
            }
        });
    };

    const handleDone = () => {
        usePaymentStore.getState().userCompleteWaitingCardPurchase();
    };

    if (!purchaseCurrency) {
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
        </MainLayout >
    );
}