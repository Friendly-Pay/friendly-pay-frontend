import { CenteredContent } from '../components/CenteredContent';
import { PaymentIcon } from '../components/PaymentIcon';
import { MainLayout } from '@/components/common/MainLayout';
import { ClockFill } from '@/components/Icons/Clock';
import { TopupBold } from '@/components/Icons/Topup';
import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useBankCard } from '@/states/cards/store';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Button, Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './TopupResultView.module.scss';

export function TopupResultView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);

    const order = usePaymentStore(state => state.topupOrder!);
    const status = usePaymentStore(state => state.topupStatus);

    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(order.receivedAmount || '0', order.receivedCurrency || undefined, languageCode);

    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    return (
        <MainLayout>
            <div className={styles.wrap}>
                <CenteredContent className={styles.content}>
                    {bankCard?.number && <Text
                        type='caption'
                        align='center'
                        weight='medium'
                        className={styles.bankAccount}
                    >
                        {t('Account')} <span>{formatCardLastFourDigits(bankCard.number)}</span>
                    </Text>}

                    <PaymentIcon className={styles.icon}>
                        <TopupBold />
                    </PaymentIcon>

                    {Boolean(order.receivedAmount && order.receivedCurrency) && <Text
                        type='headlineLarge'
                        align='center'
                        weight='semibold'
                        className={styles.amount}
                    >
                        +{formattedCurrencyParts.map((part, index) => (
                            <span
                                key={index}
                                className={styles[part.type]}
                            >
                                {part.value}
                            </span>
                        ))}
                    </Text>}

                    {status === PaymentStatus.Processing && <Text
                        weight='regular'
                        className={styles.status}
                    >
                        <ClockFill />
                        <div>{t('Top-up in progress')}</div>
                    </Text>}

                    <Text
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {t('Funds will be credited to your account after processing is complete')}
                    </Text>
                </CenteredContent>

                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleContinue}
                >
                    {t('Back to home')}
                </Button>
            </div>
        </MainLayout>
    );
}