import { BottomFixedContainer } from '@/components/common/BottomFixedContainer';
import { MainLayout } from '@/components/common/MainLayout';
import { DoorOpened } from '@/components/Icons/Door';
import { Image } from '@/components/Image/Image';
import { CurrencyAmountParts } from '@/components/Payment/CurrencyAmountParts';
import { PaymentAddress } from '@/components/Payment/PaymentAddress';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { languageCodeToLocale } from '@/localization/utils';
import { TOKENS } from '@/states/currency/tokens';
import { useDialogStore } from '@/states/dialog';
import { useBankTransferPaymentStore } from '@/states/payment/bankTransfer';
import { PaymentStatus } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { countries } from '@/states/verification/config';
import { Button, Text } from '@/uikit';
import { formatTokenCurrency } from '@/utils';
import { ExitButton } from '@/views/BankTransfer/components/ExitButton';
import { useBankTransferStore } from '@/views/BankTransfer/state/store';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './BankTransferPaymentView.module.scss';

export function BankTransferPaymentView() {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const navigate = useNavigate();

    const inputCurrency = TOKENS.USDTTRC;
    const outputCurrency = useBankTransferStore(state => state.selectedCurrency);
    const payoutAmount = useBankTransferStore(state => state.payoutAmount);

    const order = useBankTransferPaymentStore(state => state.order);
    const status = useBankTransferPaymentStore(state => state.paymentStatus);

    const timeout = useRef<any>();
    const refetchInterval = 10_000;
    useEffect(() => {
        if (!order) {
            return;
        }

        const poolingTransaction = async () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            const transactionId = order?.transactionId;
            if (!transactionId) {
                return;
            }
            try {
                const { checkPaymentTransactionStatus } = useBankTransferPaymentStore.getState();
                await checkPaymentTransactionStatus(transactionId);
            } catch (error) {
                // @TODO устанавливать payment status failed
                console.error(error);
                toast.error('Failed to get tx status');
            }

            timeout.current = setTimeout(() => poolingTransaction(), refetchInterval);
        };

        poolingTransaction();

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [order?.transactionId]);

    const handleCancel = () => {
        useDialogStore.getState().openDialog({
            title: t('Do you want to cancel?'),
            text: t('The transfer will be cancelled.<br/>Do not proceed with payment'),
            icon: <DoorOpened />,
            onConfirm: () => {
                navigate('/bank-transfer');
                useBankTransferPaymentStore.getState().resetPayment();
            },
        });
    };

    const handleDone = () => {
        useBankTransferPaymentStore.getState().userCompleteWaitingPayment();
    };

    const selectedMethod = useBankTransferStore(state => state.selectedMethod);
    const selectedCountry = useBankTransferStore(state => state.selectedCountry);
    const selectedCurrency = useBankTransferStore(state => state.selectedCurrency);
    if (!payoutAmount || !outputCurrency || !selectedMethod || !selectedCountry || !selectedCurrency) {
        return <Navigate
            to='/bank-transfer'
            replace
        />;
    }

    const emoji = (() => {
        const found = countries.find(c => c.iso2 === outputCurrency.country || c.alpha3 === outputCurrency.country);
        return found?.emoji ?? '🌐';
    })();

    if (status === PaymentStatus.UserCompleteWaiting) {
        return <Navigate
            to={'/payments/bank-transfer/waiting'}
            replace
        />;
    }

    return (
        <MainLayout>
            <ExitButton />
            <div className={styles.head}>
                <Text
                    type='headline'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Make a payment')}
                </Text>
            </div>

            <div className={styles.content}>
                <div className={styles.payment}>
                    <div className={styles.amount}>
                        <div className={styles.amountEmoji}>
                            {emoji}
                        </div>
                        <div className={styles.amountContent}>
                            <Text
                                type='body'
                                align='left'
                                weight='regular'
                            >
                                <CurrencyAmountParts
                                    value={payoutAmount}
                                    currency={outputCurrency.currency.toLowerCase()}
                                />
                            </Text>
                            <Text
                                type='caption'
                                align='left'
                                weight='regular'
                                className={styles.text}
                            >
                                {t('The recipient will receive')}
                            </Text>
                        </div>
                    </div>
                </div>

                <Text
                    type='title'
                    align='left'
                    weight='medium'
                    className={styles.title}
                >
                    <div>{t('Send')}</div>
                    {order?.sourceAmount
                        ? <div className={styles.payAmount}>
                            <Image src={inputCurrency.image} />
                            <span>{formatTokenCurrency(order.sourceAmount, languageCodeToLocale(languageCode))}</span> {inputCurrency.name} {inputCurrency.network}
                        </div>
                        : <Skeleton className={styles.amountSkeleton} />}
                    <div>{t('to the wallet:')}</div>
                </Text>

                {order
                    ? <PaymentAddress address={order.walletAddress} />
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
                            topupCurrencyName: inputCurrency.name,
                            topupCurrencyNetwork: inputCurrency.network
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
