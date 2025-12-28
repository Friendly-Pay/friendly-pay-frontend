import { SumsubContext } from '../context';
import { Image } from '@/components/Image/Image';
import { PhoneModal } from '@/components/Modals/Phone/PhoneModal';
import { useTimer } from '@/hooks/useTimer';
import { setUserPhoneNumber } from '@/states/user/fetch';
import { useUserStore } from '@/states/user/store';
import { Button, CircleCloseButton, Text } from '@/uikit';
import { FetchStatus } from '@/utils/api';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styles from './SumsubScreen.module.scss';

export function SumsubStart() {
    const {
        texts,
        icons,
        sumsubLinkFetchStatus,
        handleCancel,
        handleKycStart
    } = useContext(SumsubContext);

    const [t] = useTranslation();
    const [phoneShared, setPhoneShared] = useState(false);

    // Окно поделиться телефоном
    const [sharePhoneOpened, setSharePhoneOpened] = useState(false);
    const [sharePhoneLoading, setSharePhoneLoading] = useState(false);

    const processing = sumsubLinkFetchStatus === FetchStatus.Pending;
    const failed = sumsubLinkFetchStatus === FetchStatus.Rejected;

    const handleStart = () => {
        const user = useUserStore.getState().user;
        if (!user?.phoneNumber) {
            setSharePhoneOpened(true);
            return;
        }

        handleKycStart();
    };

    const [startTimer, clearTimer] = useTimer();

    const handlePhoneShared = async (phoneNumber: string) => {
        clearTimer();
        setSharePhoneLoading(true);

        try {
            await setUserPhoneNumber(phoneNumber);
            await useUserStore.getState().refetchUser();
            setPhoneShared(true);
            requestAnimationFrame(() => setSharePhoneOpened(false));
        } catch (error) {
            console.error(error);
            setSharePhoneLoading(false);
            setSharePhoneOpened(false);
            startTimer(() => {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                toast.error(t('We didn’t receive your phone number, please try again or contact support'));
            }, 300);
        }
    };

    return (
        <div className={styles.screen}>
            <PhoneModal
                isOpen={sharePhoneOpened}
                showLoader={sharePhoneLoading}
                onPhoneShared={handlePhoneShared}
                onClose={() => setSharePhoneOpened(false)}
            />

            <div className={styles.content}>
                <CircleCloseButton
                    className={styles.close}
                    onClick={handleCancel}
                />

                <div className={styles.head}>
                    <div className={styles.icon}>
                        <Image
                            src={icons.idle!}
                            alt=''
                        />
                    </div>
                </div>

                <div className={styles.info}>
                    <Text
                        type='headline'
                        weight='semibold'
                        align='center'
                        className={styles.title}
                    >
                        {phoneShared ? texts.idleReadyTitle : texts.idleTitle}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                    >
                        {texts.idleDescription}
                    </Text>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button
                    view='primary'
                    loading={processing}
                    disabled={failed}
                    className={styles.button}
                    onClick={handleStart}
                >
                    {phoneShared ? texts.idleReadyButton : texts.idleButton}
                </Button>

                <Button
                    view='transparent'
                    className={styles.button}
                    onClick={handleCancel}
                >
                    {texts.cancelButton}
                </Button>
            </div>
        </div>
    );
}