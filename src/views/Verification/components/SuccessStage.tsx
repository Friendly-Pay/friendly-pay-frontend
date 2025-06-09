import { StageRoot } from './common/StageRoot';
import { Confetti } from '@/components/Confetti/Confetti';
import { UserFilled } from '@/components/Icons/User';
import { useCardsStore } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { useVerificationStore } from '@/states/verification/store';
import { Button, Text } from '@/uikit';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessStage.module.scss';

export function SuccessStage() {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const refetchUser = useUserStore(state => state.refetchUser);
    const loadMyCards = useCardsStore(state => state.loadMyCards);
    useEffect(() => {
        loadMyCards();
        refetchUser();
    }, []);

    const handleClick = () => {
        navigate('/');
        useVerificationStore.getState().resetVerification();
    };

    return (
        <>
            <Confetti />

            <StageRoot className={styles.root}>
                <div className={styles.centered}>
                    <div className={styles.icon}>
                        <UserFilled />
                    </div>

                    <Text
                        type='title'
                        align='center'
                        weight='semibold'
                        className={styles.title}
                    >
                        {t('Verification complete')}
                    </Text>

                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                        className={styles.text}
                    >
                        {t('Verification was successful — now you can activate your card and start using it.')}
                    </Text>
                </div>

                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleClick}
                >
                    {t('Continue')}
                </Button>
            </StageRoot>
        </>
    );
}