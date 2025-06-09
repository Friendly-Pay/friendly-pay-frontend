import { MainLayout } from '@/components/common/MainLayout';
import { Clock } from '@/components/Icons/Clock';
import { TopupBold } from '@/components/Icons/Topup';
import { CurrencyAmountParts } from '@/components/Payment/CurrencyAmountParts';
import { useCurrentBankCard } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { Button, Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TopupResultView.module.scss';

export function TopupResultView() {
    const [t] = useTranslation();
    const bankCard = useCurrentBankCard()!;
    const order = usePaymentStore(state => state.topupOrder!);

    const navigate = useNavigate();
    const handleContinue = () => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    };

    return (
        <MainLayout fullSpace>
            <div className={styles.centered}>
                <Text
                    type='caption'
                    align='center'
                    weight='regular'
                    className={styles.label}
                >
                    {t('Top-up in progress')}
                </Text>

                <div className={styles.icon}>
                    <div className={styles.topup}><TopupBold /></div>
                    <div className={styles.clock}><Clock /></div>
                </div>

                <Text
                    type='body'
                    align='center'
                    weight='semibold'
                    className={styles.card}
                >
                    {t('Card')} <span>{formatCardLastFourDigits(bankCard.number!)}</span>
                </Text>

                {Boolean(order.receivedAmount && order.receivedCurrency) && <Text
                    type='headlineExtraLarge'
                    align='center'
                    weight='semibold'
                    className={styles.amount}
                >
                    <CurrencyAmountParts
                        value={order.receivedAmount!}
                        currency={order.receivedCurrency!}
                    />
                </Text>}

                <Text
                    type='caption'
                    align='center'
                    weight='regular'
                    className={styles.label}
                >
                    {t('As soon as the funds are credited, we will immediately send you a notification')}
                </Text>
            </div>

            <Button
                view='primary'
                className={styles.button}
                onClick={handleContinue}
            >
                {t('Continue')}
            </Button>
        </MainLayout>
    );
}