import { useAuthStore } from '@/states/auth/store';
import { useCardsStore } from '@/states/cards/store';
import { useIbanStore } from '@/states/iban/store';
import { useLoaderStore } from '@/states/loader';
import { useEffect, useRef } from 'react';

export function AppLoader() {
    const isAuth = useAuthStore(state => state.isAuth);

    const triggered = useRef<boolean>(false);
    useEffect(() => {
        if (!isAuth) return;
        if (triggered.current) return;
        triggered.current = true;

        const loadRoot = async () => {
            const setRootInitiated = useLoaderStore.getState().setRootInitiated;
            try {
                const { loadCardsTypes, loadMyCards } = useCardsStore.getState();
                const loadIbanAccount = useIbanStore.getState().loadAccount;
                await Promise.all([
                    await loadCardsTypes(),
                    await loadMyCards(),
                    await loadIbanAccount()
                ]);
            } catch (error) {
                console.error('Ошибка при загрузке данных карт', error);
            }

            setRootInitiated(true);
        };

        loadRoot();
    }, [isAuth]);

    return null;
}