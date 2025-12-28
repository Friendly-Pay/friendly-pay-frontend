import { Image } from '@/components/Image/Image';
import { Button, Modal, ModalBody, ModalHead, ModalProps, Spinner, Text } from '@/uikit';
import phone from 'assets/phone.png';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PhoneModal.module.scss';

type PhoneModalProps = {
    /**
     * Скрывает кнопки, и показывает Spinner
    */
    showLoader: boolean;

    onPhoneShared: (phone: string) => void
}

const loaderAppearance = {
    initial: {
        opacity: 0,
        scale: 0.8
    },
    animate: {
        opacity: 1,
        scale: 1
    },
    transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
    }
};

export function PhoneModal({ isOpen, showLoader, onClose, onAnimationCompleted, onPhoneShared }: PhoneModalProps & ModalProps) {
    const [t] = useTranslation();
    const [supportsRequestContact, setSupportsRequestContact] = useState(true);

    // Загрузка нативного окна share от Telegram
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const supports = window.Telegram.WebApp.isVersionAtLeast('6.9');
        setSupportsRequestContact(supports || import.meta.env.DEV);
    }, []);

    const timerId = useRef<number>(0);

    const clearTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    }, []);

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    }, [isOpen]);

    const handlePhoneShare = () => {
        if (loading || !supportsRequestContact) return;
        clearTimer();
        setLoading(true);

        // DEV ручка
        if (import.meta.env.DEV) {
            // @ts-ignore
            window.setSharedPhone = (phoneNumber: string) => {
                setLoading(false);
                onPhoneShared(phoneNumber);
            };
        }

        timerId.current = setTimeout(() => {
            try {
                window.Telegram.WebApp.requestContact((shared: boolean, phone?: RequestContactResponse) => {
                    if (shared && phone?.status === 'sent') {
                        onPhoneShared(phone.responseUnsafe.contact.phone_number);
                    }
                    setLoading(false);
                });
            } catch (error) {
                setLoading(false);
                setSupportsRequestContact(false);
                console.error('Failed to request phone number', error);
            }
        }, 1_000);
    };

    const handleClose = () => {
        if (showLoader || loading) {
            return;
        }
        onClose?.();
    };

    const renderButtons = () => {
        if (showLoader) {
            return (
                <div className={styles.buttons}>
                    <motion.div
                        className={styles.loaderWrap}
                        {...loaderAppearance}
                    >
                        <Spinner className={styles.spinner} />
                    </motion.div>
                </div>
            );
        }

        return (
            <div className={styles.buttons}>
                <Button
                    view='primary'
                    loading={loading}
                    disabled={!supportsRequestContact}
                    className={styles.button}
                    onClick={handlePhoneShare}
                >
                    {t('Share')}
                </Button>

                <Button
                    view='transparent'
                    className={styles.button}
                    onClick={handleClose}
                >
                    {t('Cancel')}
                </Button>
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            fullscreen
            padding={false}
            onAnimationCompleted={onAnimationCompleted}
            onClose={handleClose}
        >
            <ModalHead />
            <ModalBody className={styles.body}>
                <div className={styles.content}>
                    <div className={styles.head}>
                        <div className={styles.icon}>
                            <Image
                                src={phone}
                                alt=''
                            />
                        </div>
                    </div>

                    <div className={styles.info}>
                        <Text
                            type='title'
                            weight='semibold'
                            align='center'
                            className={styles.title}
                            dangerouslySetInnerHTML={{ __html: t('First, we need<br/>your phone number') }}
                        />

                        <Text
                            type='body'
                            weight='regular'
                            align='center'
                            className={styles.text}
                        >
                            {t('We use your phone number only for important notifications and security')}
                        </Text>
                    </div>
                </div>

                {renderButtons()}
            </ModalBody>
        </Modal >
    );
}