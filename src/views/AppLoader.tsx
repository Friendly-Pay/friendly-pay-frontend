import { GptonLogo } from '@/components/Image/Gpton';
import { useAuthStore } from '@/states/auth/store';
import { useCardsStore } from '@/states/cards/store';
import { useLoaderStore } from '@/states/loader';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styles from './AppLoader.module.scss';

const minLoaderTimeMs = 700;

const appearance = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1
    },
    transition: {
        ease: 'easeInOut',
        duration: 0.3
    }
};

export function AppLoader() {
    const isAuth = useAuthStore(state => state.isAuth);
    const rootInitiated = useLoaderStore(state => state.rootInitiated);

    const triggered = useRef<boolean>(false);
    useEffect(() => {
        if (!isAuth) return;
        if (triggered.current) return;
        triggered.current = true;

        let loadingTimeout: any;

        const completeLoading = () => {
            const setRootInitiated = useLoaderStore.getState().setRootInitiated;
            setRootInitiated(true);
        };

        const loadRoot = async () => {
            const startTimestamp = Date.now();
            try {
                const { loadCardsTypes, loadMyCards } = useCardsStore.getState();
                await Promise.all([
                    await loadCardsTypes(),
                    await loadMyCards()
                ]);
            } catch (error) {
                console.error('Ошибка при загрузке данных карт', error);
            } finally {
                const elapsed = Date.now() - startTimestamp;
                const wait = minLoaderTimeMs - elapsed;
                if (wait > 0) {
                    loadingTimeout = setTimeout(completeLoading, wait);
                } else {
                    completeLoading();
                }
            }
        };

        loadRoot();

        return () => {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
        };
    }, [isAuth]);

    if (rootInitiated) {
        return null;
    }

    return (
        <motion.div
            {...appearance}
            className={styles.loader}
        >
            <GptonLogo className={styles.logo} />
        </motion.div>
    );
}