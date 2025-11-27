import { StageRoot } from './Сommon/StageRoot';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useCardsStore } from '@/states/cards/store';
import { useVerificationStore } from '@/states/verification/store';
import { Input, Text } from '@/uikit';
import parsePhoneNumber from 'libphonenumber-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './PhoneStage.module.scss';

export function PhoneStage() {
    const [t] = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [supportsRequestContact, setSupportsRequestContact] = useState(true);

    const triggered = useRef(false);
    useEffect(() => {
        const supports = window.Telegram.WebApp.isVersionAtLeast('6.9');
        setSupportsRequestContact(supports || import.meta.env.DEV);
        if (supports && !triggered.current) {
            triggered.current = true;
            handlePhoneShare();
        }
    }, []);

    const parsedPhone = parsePhoneNumber(`+${phoneNumber}`);
    const handlePhoneShare = () => {
        if (submitLoading || !supportsRequestContact) return;
        try {
            window.Telegram.WebApp.requestContact((shared: boolean, phone?: RequestContactResponse) => {
                if (shared && phone?.status === 'sent') {
                    setPhoneNumber(phone.responseUnsafe.contact.phone_number);
                }
            });
        } catch (error) {
            toast.error('Failed to request phone number');
            console.error('Failed to request phone number', error);
        }
    };

    const isSubmitDisabled = !phoneNumber.length;
    const navigate = useNavigate();
    const setStage = useVerificationStore(state => state.setStage);
    const setUserDataProperty = useVerificationStore(state => state.setUserDataProperty);

    const handleSubmit = useCallback(async () => {
        if (isSubmitDisabled) return;
        setUserDataProperty('phoneNumber', phoneNumber);
        const { data, setCardId } = useVerificationStore.getState();
        try {
            setSubmitLoading(true);
            await useCardsStore.getState().activateCard({
                cardId: data.cardId!,
                email: data.email!,
                phoneNumber: phoneNumber!,
                firstName: data.firstName!,
                lastName: data.lastName!,
                birthday: data.birthday!,
                country: data.country!,
                town: data.town!,
                address: data.address!,
                postCode: data.postCode!
            });
            await useCardsStore.getState().loadMyCards();
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            navigate('/');
        } catch (error) {
            console.error(error);
            if (data.cardId) {
                setCardId(data.cardId);
                navigate('/verification/user/error');
            } else {
                navigate('/');
            }
        } finally {
            setSubmitLoading(false);
        }
    }, [isSubmitDisabled, phoneNumber, setStage, setUserDataProperty]);

    return (
        <StageRoot className={styles.root}>
            <div className={styles.content}>
                <Text
                    type='headline'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Only your phone number is left and we get started 📞')}
                </Text>

                <div className={styles.field}>
                    <Input
                        type='text'
                        name='phoneNumber'
                        value={parsedPhone?.formatInternational() || phoneNumber}
                        autoFocus={true}
                        onClick={handlePhoneShare}
                        placeholder={t('Phone number')}
                        autoComplete='off'
                        readOnly
                    />
                </div>
            </div>

            <TelegramMainButton
                text={t('Continue')}
                loading={submitLoading}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            />
        </StageRoot>
    );
}