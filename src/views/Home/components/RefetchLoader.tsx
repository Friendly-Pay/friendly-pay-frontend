
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
    const isRefreshing = useRef(false); // Флаг для отслеживания состояния обновления
    const isPullActive = useRef(false); // Флаг активного жеста "pull-to-refresh"

    useLayoutEffect(() => {
        const mainLayout = document.getElementById('mainContent');
        if (!mainLayout) return;

        const loadCards = useCardsStore.getState().loadMyCards;

        const refetchCards = async () => {
            if (isRefreshing.current) return;
            try {
                isRefreshing.current = true;
                setLoading(true);
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                const start = performance.now();
                const minLoaderTimeMs = 300;
                await loadCards();
                const elapsed = performance.now() - start;
                const wait = minLoaderTimeMs - elapsed;
                if (wait > 0) {
                    await new Promise<void>(r => setTimeout(r, wait));
                }
            } finally {
                isRefreshing.current = false;
                setLoading(false);
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            isPullActive.current = true;
            if (mainLayout.scrollTop <= 0) {
                startY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPullActive.current || mainLayout.scrollTop > 0) return;

            const currentY = e.touches[0].clientY;
            const delta = currentY - startY.current;

            if (delta < 0) return;
            if (delta > 170 && !isRefreshing.current) {
                refetchCards();
                isPullActive.current = false;
            }
        };

        const handleTouchEnd = () => {
            isPullActive.current = false;
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