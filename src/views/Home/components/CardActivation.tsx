import { ActivationProgress } from '@/components/Bank/Activation/ActivationProgress';
import { CardStatus, useCardsStore } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { useVerificationStore } from '@/states/verification/store';
import { Button } from '@/uikit';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './CardActivation.module.scss';

type CardActivationProps = {
    cardId: number
    status: CardStatus
}

// @TODO разный текст если долгая загрузка активации и отдельный вид (как я делал)
export function CardActivation({ cardId, status }: CardActivationProps) {
    const [t] = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setCardId = useVerificationStore(state => state.setCardId);
    const resetVerification = useVerificationStore(state => state.resetVerification);

    const startActivation = async () => {
        if (loading) return;
        const user = useUserStore.getState().user!;
        const userData = {
            email: user.email,
            phoneNumber: user.phoneNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            birthday: user.birthday,
            country: user.country,
            town: user.town,
            address: user.address,
            postCode: user.postCode
        };

        let needKyc = false;
        for (const field of Object.values(userData)) {
            if (!field) {
                needKyc = true;
                break;
            }
        }

        if (needKyc) {
            resetVerification();
            setCardId(cardId);
            navigate('/verification/user');
            return;
        }
        try {
            setLoading(true);
            await useCardsStore.getState().activateCard({
                cardId,
                ...(userData as Record<keyof typeof userData, string>)
            });
            await useCardsStore.getState().loadMyCards();
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        } catch (error) {
            console.error('Card activation failed', error);
            toast.error('Card activation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.root}>
            {status === CardStatus.NeedActivation
                ? <Button
                    view='primary'
                    loading={loading}
                    onClick={startActivation}
                >
                    {t('Activate card')}
                </Button>
                : <ActivationProgress status={status} />}
        </div>
    );
}