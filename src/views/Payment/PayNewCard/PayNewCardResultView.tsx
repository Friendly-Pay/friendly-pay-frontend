import { MainLayout } from '@/components/common/MainLayout';
import { Confetti } from '@/components/Confetti/Confetti';
import { BankCardFill } from '@/components/Icons/BankCard';
import { usePaymentStore } from '@/states/payment/store';
import { Button, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './PayNewCardResultView.module.scss';

export function PayNewCardResultView() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const handleContinue = () => {
        navigate('/');
        usePaymentStore.getState().resetTopup();
    };

    return (
        <MainLayout fullSpace>
            <Confetti />
            <div className={styles.centered}>
                <div className={styles.icon}>
                    <BankCardFill />
                </div>

                <Text
                    type='headlineLarge'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Card issued')}
                </Text>

                <Text
                    type='caption'
                    align='center'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Payment was successful — you only need to activate the card to start using it')}
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