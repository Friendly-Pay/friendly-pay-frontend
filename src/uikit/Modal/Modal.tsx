import { ModalContext, ModalState } from './Context';
import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './Modal.module.scss';

export type ModalProps = {
    isOpen: boolean
    padding?: boolean
    fullscreen?: boolean
    onClose?: () => void
    onAnimationStart?: () => void
    onAnimationCompleted?: () => void
}

const backdropAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

const boxAnimDefault = {
    initial: {
        transform: 'translateY(100%)',
    },
    animate: {
        transform: 'translateY(0%)',
        transition: {
            type: 'spring',
            damping: 28,
            mass: 0.71,
            stiffness: 400,
            restDelta: 0.001
        }
    },
    exit: {
        transform: 'translateY(100%)',
        transition: { duration: 0.18, ease: [0.4, 0.05, 0.75, 0.7] }
    }
};

const boxAnimSlow = {
    initial: {
        transform: 'translateY(100%)',
    },
    animate: {
        transform: 'translateY(0%)',
        transition: {
            type: 'spring',
            damping: 30,
            mass: 0.7,
            stiffness: 300,
            restDelta: 0.001
        }
    },
    exit: {
        transform: 'translateY(100%)',
        transition: { duration: 0.20, ease: [0.3, 0.05, 0.3, 0.2] }
    }
};

const portalRoot = typeof window !== 'undefined'
    ? document.getElementById('modal-elements') || document.body
    : null;

export function Modal({ isOpen, onClose, onAnimationStart, onAnimationCompleted, padding = true, fullscreen, children }: PropsWithChildren<ModalProps>) {
    const scrollableBodyRef = useRef<HTMLDivElement>(null);
    const contextProvider: ModalState = useMemo(() => ({
        isOpen,
        close: onClose,
        bodyRef: scrollableBodyRef
    }), [isOpen, onClose, scrollableBodyRef.current]);

    const handleOverlayClick = () => {
        onClose?.();
    };

    const boxAnim = fullscreen
        ? boxAnimSlow
        : boxAnimDefault;

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
                        className={classNames(styles.box, padding && styles.padding, fullscreen && styles.fullscreen)}
                        onAnimationStart={onAnimationStart}
                        onAnimationComplete={onAnimationCompleted}
                    >
                        <ModalContext.Provider value={contextProvider}>
                            {children}
                        </ModalContext.Provider>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalRoot
    );
}