import { CenteredContent } from '../components/CenteredContent';
import { PaymentIcon } from '../components/PaymentIcon';
import { MainLayout } from '@/components/common/MainLayout';
import { Confetti } from '@/components/Confetti/Confetti';
import { BankCardFill } from '@/components/Icons/BankCard';
import { usePaymentStore } from '@/states/payment/store';
import { Button, Text } from '@/uikit';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './PayNewCardResultView.module.scss';

export function PayNewCardResultView() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const handleContinue = useCallback(() => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    }, [navigate]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    return (
        <MainLayout fullHeight>
            <Confetti />
            <div className={styles.wrap}>
                <CenteredContent className={styles.data}>
                    <PaymentIcon className={styles.icon}>
                        <BankCardFill />
                    </PaymentIcon>

                    <Text
                        type='headline'
                        align='center'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Card issued')}
                    </Text>

                    <Text
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {t('Payment was successful — you only need to activate the card to start using it')}
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