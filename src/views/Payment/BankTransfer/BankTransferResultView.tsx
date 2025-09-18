import { CenteredContent } from '../components/CenteredContent';
import { PaymentIcon } from '../components/PaymentIcon';
import { MainLayout } from '@/components/common/MainLayout';
import { useBankTransferPaymentStore } from '@/states/payment/bankTransfer';
import { Text } from '@/uikit';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './BankTransferResultView.module.scss';

export function BankTransferResultView() {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const handleBackHome = (e: any) => {
        e.preventDefault();
        useBankTransferPaymentStore.getState().resetPayment();
        navigate('/bank-transfer');
    };

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }, []);

    return (
        <MainLayout>
            <div className={styles.wrap}>
                <CenteredContent className={styles.content}>
                    {<Text
                        type='caption'
                        align='center'
                        weight='medium'
                        className={styles.label}
                    >
                        {t('Card transfer')}
                    </Text>}

                    <PaymentIcon className={styles.icon}>
                        <Bank />
                    </PaymentIcon>

                    <Text
                        type='headlineLarge'
                        align='center'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Payment in progress')}
                    </Text>

                    <Text
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {t('You will receive a notification about the payment result. If additional information is required, we will inform you')}
                    </Text>

                    <a
                        href='/'
                        className={styles.button}
                        onClick={handleBackHome}
                    >{t('Back to home')}</a>
                </CenteredContent>
            </div>
        </MainLayout>
    );
}

const Bank = () => {
    return (
        <svg
            width="40"
            height="39"
            viewBox="0 0 40 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.56153 33.802V32.5076C2.56153 32.128 2.66507 31.8346 2.87216 31.6276C3.09074 31.409 3.39563 31.2998 3.78679 31.2998H4.77044V12.6275H3.28634C2.75711 12.6275 2.34295 12.4665 2.04382 12.1444C1.7447 11.8107 1.59514 11.4483 1.59514 11.0571C1.59514 10.4474 1.94028 9.94694 2.63057 9.55578L17.6097 0.909995C18.3115 0.484322 19.0478 0.271484 19.8186 0.271484C20.5779 0.271484 21.3257 0.484322 22.062 0.909995L37.0411 9.55578C37.7199 9.94694 38.0593 10.4474 38.0593 11.0571C38.0593 11.4483 37.9097 11.8107 37.6107 12.1444C37.323 12.4665 36.9146 12.6275 36.3854 12.6275H34.9012V31.2998H35.9021C36.2818 31.2998 36.5753 31.409 36.7823 31.6276C37.0009 31.8346 37.1101 32.128 37.1101 32.5076V33.802H2.56153ZM7.63511 31.2998H32.0193V10.3151L20.4398 3.80918C20.2213 3.70565 20.0141 3.65386 19.8186 3.65386C19.623 3.65386 19.4275 3.70565 19.2319 3.80918L7.63511 10.3151V31.2998ZM1.54337 38.2715C1.11769 38.2715 0.749542 38.1161 0.438915 37.8056C0.139795 37.495 -0.00976562 37.121 -0.00976562 36.6839C-0.00976562 36.2581 0.139795 35.8901 0.438915 35.5794C0.749542 35.2803 1.11769 35.1307 1.54337 35.1307H37.9903C38.416 35.1307 38.7842 35.2803 39.0947 35.5794C39.4168 35.8901 39.5779 36.2581 39.5779 36.6839C39.5779 37.121 39.4168 37.495 39.0947 37.8056C38.7842 38.1161 38.416 38.2715 37.9903 38.2715H1.54337Z"
                fill="black"
            />
        </svg>
    );
};