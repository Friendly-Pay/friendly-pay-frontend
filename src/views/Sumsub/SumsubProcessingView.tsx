import { ScreenLoader } from './components/ScreenLoader';
import { MainLayout } from '@/components/common/MainLayout';
import { useIbanStore } from '@/states/iban/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function SumsubProcessingView() {
    const navigate = useNavigate();

    useEffect(() => {
        const minLoaderTimeMs = 700;

        const redirect = () => {
            navigate('/bank/account', { replace: true });
        };

        let timeout: any;
        const load = async () => {
            const start = performance.now();

            const loadAccount = useIbanStore.getState().loadAccount;
            await loadAccount();
            const elapsed = performance.now() - start;
            const wait = minLoaderTimeMs - elapsed;
            if (wait > 0) {
                timeout = setTimeout(redirect, wait);
            } else {
                redirect();
            }
        };
        load();

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    return (
        <MainLayout
            fullHeight
            fullSpace
        >
            <ScreenLoader visible />
        </MainLayout >
    );
}