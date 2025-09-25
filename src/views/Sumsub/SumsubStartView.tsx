import { Verification } from './components/Verification';
import { MainLayout } from '@/components/common/MainLayout';
import { Button, CircleCloseButton, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './SumsubStartView.module.scss';

export function SumsubStartView() {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/sumsub/bank-account');
    };

    const handleCancel = () => {
        navigate('/bank/account');
    };

    return (
        <MainLayout
            fullHeight
            className={styles.layout}
        >
            <div className={styles.content}>
                <CircleCloseButton
                    className={styles.close}
                    onClick={handleCancel}
                />

                <div className={styles.head}>
                    <div className={styles.icon}>
                        <Verification />
                    </div>
                </div>

                <div className={styles.info}>
                    <Text
                        type='headline'
                        weight='semibold'
                        align='center'
                        className={styles.title}
                    >
                        {t('Complete verification')}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                    >
                        {t('We will ask you for documents, a selfie and address confirmation')}
                    </Text>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleStart}
                >
                    {t('Start')}
                </Button>

                <Button
                    view='transparent'
                    className={styles.button}
                    onClick={handleCancel}
                >
                    {t('Cancel')}
                </Button>
            </div>

        </MainLayout>
    );
}