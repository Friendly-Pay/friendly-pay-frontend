import { MainLayout } from '@/components/common/MainLayout';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useVerificationStore } from '@/states/verification/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './VerificationErrorView.module.scss';

export function VerificationErrorView() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setCardId = useVerificationStore(state => state.setCardId);
    const resetVerification = useVerificationStore(state => state.resetVerification);

    const handleStartOver = () => {
        const cardId = useVerificationStore.getState().data.cardId;
        if (cardId) {
            resetVerification();
            setCardId(cardId);
            navigate('/verification/user');
        } else {
            navigate('/');
        }
    };

    return (
        <MainLayout className={styles.content}>
            <div className={styles.head}>
                <Text
                    type='headline'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >{t('An error occurred while activating your card 🚫')}</Text>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >{t('Please enter your details again and submit the card activation request')}</Text>
            </div>

            <TelegramMainButton
                text={t('Start over')}
                onClick={handleStartOver}
            />
        </MainLayout>
    );
}