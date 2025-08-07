import { Button } from '../Button';
import { Text } from '../Text';
import { CloseFill } from '@/components/Icons/Close';
import { useDeviceStore } from '@/states/device/state';
import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './Dialog.module.scss';

type DialogProps = {
    isOpen: boolean,
    title?: string | null,
    text?: string | null,
    icon?: ReactNode | null,
    onConfirm?: () => void,
    onCancel?: () => void,
    onClose?: () => void
    onAnimationCompleted?: () => void
}

const backdropAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { delay: 0.1 } },
    transition: { duration: 0.2 }
};

const boxAnim = {
    initial: {
        opacity: 0,
        transform: 'translateY(100%)',
    },
    animate: {
        opacity: 1,
        transform: 'translateY(0%)',
        transition: {
            transform: {
                type: 'spring',
                damping: 26,
                mass: 0.6,
                stiffness: 300,
                restDelta: 0.001
            },
            opacity: {
                duration: 0.15,
                ease: 'easeIn',
            },
        }
    },
    exit: {
        transform: 'translateY(125%)',
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
};

const portalRoot = document.body;

export function Dialog({ isOpen, title, text, icon, onConfirm, onCancel, onClose, onAnimationCompleted }: PropsWithChildren<DialogProps>) {
    const [t] = useTranslation();
    const contentSafeAreaInset = useDeviceStore(state => state.contentSafeAreaInset);
    const bottomMargin = Math.max(contentSafeAreaInset.bottom, 10);

    const handleOverlayClick = () => {
        onClose?.();
    };

    useEffect(() => {
        if (!isOpen) return;
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }, [isOpen]);

    if (!portalRoot) {
        return null;
    }

    return createPortal(
        <AnimatePresence
            mode='wait'
            initial={false}
        >
            {isOpen && (
                <>
                    <motion.div
                        {...backdropAnim}
                        className={styles.backdrop}
                        onClick={handleOverlayClick}
                    />

                    <motion.div
                        {...boxAnim}
                        className={styles.dialog}
                        style={{ marginBottom: `${bottomMargin}px` }}
                        onAnimationComplete={onAnimationCompleted}
                    >
                        <div
                            className={styles.close}
                            onClick={onCancel}
                        >
                            <CloseFill />
                        </div>

                        <div className={styles.content}>
                            {icon && <div className={styles.iconWrap}>
                                <div className={styles.icon}>
                                    {icon}
                                </div>
                            </div>}
                            {title && <Text
                                align='center'
                                weight='semibold'
                                className={styles.title}
                            >{title}</Text>}

                            {text && <Text
                                align='center'
                                weight='regular'
                                className={styles.text}
                                dangerouslySetInnerHTML={{ __html: text }}
                            ></Text>}

                            <div className={styles.buttons}>
                                <Button
                                    view='secondary'
                                    className={styles.button}
                                    onClick={onConfirm}
                                >
                                    {t('Yes')}
                                </Button>
                                <Button
                                    view='primary'
                                    className={styles.button}
                                    onClick={onCancel}
                                >
                                    {t('No')}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalRoot
    );
}