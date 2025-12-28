import { CardStatus, useCardsStore } from '@/states/cards/store';
import { Button } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './CardActivation.module.scss';

type CardActivationProps = {
    cardId: number
    status: CardStatus
}

// @TODO failed state
export function CardActivation({ cardId, status }: CardActivationProps) {
    const [t] = useTranslation();

    const startActivation = async () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        await useCardsStore.getState().activateCard(cardId);
    };

    return (
        <div className={styles.root}>
            <Button
                view='primary'
                onClick={startActivation}
            >
                {status === CardStatus.NeedActivation ? t('Activate card') : t('One moment...')}
            </Button>
        </div>
    );
}