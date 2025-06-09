import { StageRoot } from './common/StageRoot';
import { Exclamationmark } from '@/components/Icons/Exclamationmark';
import { useVerificationStore } from '@/states/verification/store';
import { Button, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './FailedStage.module.scss';

export function FailedStage() {
    const [t] = useTranslation();
    const completeError = useVerificationStore(state => state.completeError);

    const handleClick = () => {
        useVerificationStore.getState().resetVerification();
    };

    return (
        <StageRoot className={styles.root}>
            <div className={styles.centered}>
                <div className={styles.icon}>
                    <Exclamationmark />
                </div>

                <Text
                    type='title'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Verification error')}
                </Text>

                {completeError && <Text
                    type='body'
                    align='center'
                    weight='regular'
                    className={styles.text}
                >
                    {t(completeError)}
                </Text>}
            </div>

            <Button
                view='primary'
                className={styles.button}
                onClick={handleClick}
            >
                {t('Start over')}
            </Button>
        </StageRoot>
    );
}