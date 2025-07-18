import { ModalContext, ModalState } from './Context';
import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './Modal.module.scss';

export type ModalProps = {
    isOpen: boolean
    fullscreen?: boolean
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
        transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
    }
};

const portalRoot = typeof window !== 'undefined'
    ? document.getElementById('modal-elements') || document.body
    : null;

export function Modal({ isOpen, onClose, onAnimationCompleted, fullscreen, children }: PropsWithChildren<ModalProps>) {
    const scrollableBodyRef = useRef<HTMLDivElement>(null);
    const contextProvider: ModalState = useMemo(() => ({
        isOpen,
        close: onClose,
        bodyRef: scrollableBodyRef
    }), [isOpen, onClose, scrollableBodyRef.current]);

    const handleOverlayClick = () => {
        onClose?.();
    };

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
                        className={classNames(styles.box, fullscreen && styles.fullscreen)}
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