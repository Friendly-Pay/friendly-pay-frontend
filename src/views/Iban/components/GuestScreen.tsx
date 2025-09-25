import { IbanBanners } from './Banners/IbanBanners';
import { Button, Text } from '@/uikit';
import euro from 'assets/iban/eur.png?inline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './GuestScreen.module.scss';

export function GuestScreen() {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const handleStartKyc = () => {
        navigate('/sumsub/start');
    };

    return (
        <div className={styles.root}>
            <div className={styles.head}>
                <div className={styles.euro}>
                    <img
                        src={euro}
                        alt=''
                    />
                </div>
                <div className={styles.offer}>
                    <Text
                        type='headline'
                        weight='semibold'
                        align='center'
                        className={styles.title}
                    >
                        {t('Your bank account')}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                    >
                        {t('Free opening. For payments across Europe and beyond')}
                    </Text>
                </div>
            </div>
            <div className={styles.content}>
                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleStartKyc}
                >
                    {t('Open account')}
                </Button>

                <IbanBanners className={styles.banners} />
            </div>
        </div>
    );
}