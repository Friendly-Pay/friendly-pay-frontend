import { IbanBanners } from './Banners/IbanBanners';
import { IbanStatus, useIbanStore } from '@/states/iban/store';
import { Button, Text } from '@/uikit';
import euro from 'assets/iban/eur.png?inline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './GuestScreen.module.scss';

interface GuestScreenProps {
    available: boolean
    accountStatus: IbanStatus
}

export function GuestScreen({ available, accountStatus }: GuestScreenProps) {
    const [t] = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleOpenAccount = async () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        setLoading(true);
        await useIbanStore.getState().activateIbanAccount();
        setLoading(false);
    };

    const getStatusText = () => {
        if (!available) {
            return t('Unavailable');
        }

        switch (accountStatus) {
            case IbanStatus.Idle:
                return t('Open account');

            case IbanStatus.InProgress:
            case IbanStatus.Activated:
                return t('Opening...');

            case IbanStatus.Failed:
                return t('Account opening error');
        }
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
                    loading={loading}
                    disabled={!available}
                    className={styles.button}
                    onClick={handleOpenAccount}
                >
                    {getStatusText()}
                </Button>

                <IbanBanners className={styles.banners} />
            </div>
        </div>
    );
}