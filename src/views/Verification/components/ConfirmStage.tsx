import { StageRoot } from './common/StageRoot';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Button, Text } from '@/uikit';
import documents from 'assets/documents.png?inline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmStage.module.scss';

export function ConfirmStage() {
    const [t] = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        useVerificationStore.getState().setStage(VerificationStage.PersonalData);
    };

    const handleConfirm = async () => {
        setLoading(true);
        await useVerificationStore.getState().completeVerification();
        setLoading(false);
    };

    return (
        <StageRoot className={styles.root}>
            <div className={styles.centered}>
                <div className={styles.image}>
                    <img
                        src={documents}
                        alt=''
                        className={styles.image}
                    />
                </div>

                <Text
                    type='title'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Data correct?')}
                </Text>

                <Text
                    type='body'
                    align='center'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Incorrect name and date of birth may restrict account functionality.')}
                </Text>
            </div>

            <div className={styles.buttons}>
                <Button
                    view='secondary'
                    onClick={handleBack}
                >
                    {t('Back')}
                </Button>

                <Button
                    view='primary'
                    loading={loading}
                    onClick={handleConfirm}
                >
                    {t('Confirm')}
                </Button>
            </div>
        </StageRoot>
    );
}