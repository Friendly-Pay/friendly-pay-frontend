
import { useCardsStore } from '@/states/cards/store';
import { BarSpinner } from '@/uikit';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './RefetchLoader.module.scss';

const loaderAppearance = {
    initial: { scale: 0.75, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.75, opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export function RefetchLoader() {
    const [loading, setLoading] = useState(false);

    const startY = useRef(0);
    const fetching = useRef(false);
    const touchProcessing = useRef(false);

    useLayoutEffect(() => {
        const mainLayout = document.getElementById('mainLayout');
        if (!mainLayout) {
            return;
        }

        const loadCards = useCardsStore.getState().loadMyCards;
        const refetchCards = async () => {
            if (fetching.current) {
                return;
            }
            try {
                fetching.current = true;
                setLoading(true);
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                await loadCards();
            } finally {
                fetching.current = false;
                if (!touchProcessing.current) {
                    setLoading(false);
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchProcessing.current = true;
            if (mainLayout.scrollTop <= 0) {
                const clientY = e.touches[0].clientY;
                startY.current = clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const clientY = e.touches[0].clientY;
            const delta = clientY - startY.current;

            if (mainLayout.scrollTop <= 0) {
                if (delta > 170) {
                    refetchCards();
                }
            } else if (mainLayout.scrollTop > 1) {
                setLoading(false);
            }
        };

        const handleTouchEnd = () => {
            touchProcessing.current = false;
        };

        mainLayout.addEventListener('touchstart', handleTouchStart, { passive: true });
        mainLayout.addEventListener('touchmove', handleTouchMove, { passive: true });
        mainLayout.addEventListener('touchend', handleTouchEnd);

        return () => {
            mainLayout.removeEventListener('touchstart', handleTouchStart);
            mainLayout.removeEventListener('touchmove', handleTouchMove);
            mainLayout.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return createPortal(
        <AnimatePresence
            mode='wait'
            initial={false}
        >
            {loading && <motion.div
                {...loaderAppearance}
                className={styles.loader}
            >
                <BarSpinner
                    size={24}
                    className={styles.spinner}
                />
            </motion.div>}
        </AnimatePresence>,
        document.body
    );
}