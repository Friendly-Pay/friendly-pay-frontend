import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Button, Text } from '@/uikit';
import logo from 'assets/logo.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './IntroStage.module.scss';

export function IntroStage() {
    const [t] = useTranslation();
    const handleClick = () => {
        useVerificationStore.getState().setStage(VerificationStage.PhoneNumber);
    };

    return (
        <div className={styles.root}>
            <div className={styles.centered}>
                <img
                    src={logo}
                    alt=''
                    className={styles.image}
                />

                <Text
                    type='title'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Verify your identity')}
                </Text>

                <Text
                    type='body'
                    align='center'
                    weight='regular'
                    className={styles.text}
                >
                    {t('To activate your card and start using it. It will take a few minutes.')}
                </Text>
            </div>

            <Button
                view='primary'
                className={styles.button}
                onClick={handleClick}
            >
                {t('Next!')}
            </Button>
        </div>
    );
}