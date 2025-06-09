import { StageRoot } from './common/StageRoot';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Button, Text } from '@/uikit';
import phone from 'assets/phone.png';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styles from './PhoneStage.module.scss';

export function PhoneStage() {
    const [t] = useTranslation();
    const [loading, setLoading] = useState(false);
    const [supportsRequestContact, setSupportsRequestContact] = useState(true);

    useEffect(() => {
        const supports = window.Telegram.WebApp.isVersionAtLeast('6.9');
        setSupportsRequestContact(supports || import.meta.env.DEV);
    }, []);

    const handleClick = () => {
        setLoading(true);
        try {
            window.Telegram.WebApp.requestContact((shared: boolean, phone?: RequestContactResponse) => {
                setLoading(false);
                if (shared && phone?.status === 'sent') {
                    useVerificationStore.getState().setUserDataProperty('phoneNumber', phone.responseUnsafe.contact.phone_number);
                    useVerificationStore.getState().setStage(VerificationStage.PersonalData);
                }
            });
        } catch (error) {
            setLoading(false);
            if (import.meta.env.DEV) {
                useVerificationStore.getState().setUserDataProperty('phoneNumber', '79287546885');
                useVerificationStore.getState().setStage(VerificationStage.PersonalData);
                return;
            }
            toast.error('Failed to request phone number');
            console.error('Failed to request phone number', error);
        }
    };

    return (
        <StageRoot className={styles.root}>
            <div className={styles.centered}>
                <div className={styles.image}>
                    <img
                        src={phone}
                        alt=''
                    />
                </div>

                <Text
                    type='title'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Phone number')}
                </Text>

                <Text
                    type='body'
                    align='center'
                    weight='regular'
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: t('Share your phone number<br /> to continue.') }}
                />
            </div>

            <Button
                view='primary'
                loading={loading}
                className={styles.button}
                disabled={!supportsRequestContact}
                onClick={handleClick}
            >
                {supportsRequestContact ? t('Share') : t('Update Telegram')}
            </Button>
        </StageRoot>
    );
}