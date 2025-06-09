import { ModalContext, ModalState } from './Context';
import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

export type ModalProps = {
    isOpen: boolean,
    onClose?: () => void,
    onAnimationCompleted?: () => void
}

const backdropAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
};

const boxAnim = {
    initial: { transform: 'translateY(100%)' },
    animate: { transform: 'translateY(0%)' },
    exit: { transform: 'translateY(100%)' },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

const portalRoot = typeof window !== 'undefined'
    ? document.getElementById('modal-elements') || document.body
    : null;

export function Modal({ isOpen, onClose, onAnimationCompleted, children }: PropsWithChildren<ModalProps>) {
    const scrollableBodyRef = useRef<HTMLDivElement>(null);

    const contextProvider: ModalState = {
        isOpen,
        close: onClose,
        bodyRef: scrollableBodyRef
    };

    const handleOverlayClick = () => {
        onClose?.();
    };

    if (!portalRoot) {
        return null;
    }

    return createPortal(
        <AnimatePresence mode='wait'>
            {isOpen && (
                <>
                    <motion.div
                        key='backdrop'
                        {...backdropAnim}
                        className={styles.backdrop}
                        onClick={handleOverlayClick}
                        transition={{ duration: 0.15, }}
                    />

                    <motion.div
                        key='box'
                        {...boxAnim}
                        className={styles.box}
                        onAnimationComplete={onAnimationCompleted}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                        }}
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