import { useBankTransferCurrenciesStore } from './state/currencies';
import { useBankTransferRequiredFields } from './state/fields';
import { useBankTransferStore } from './state/store';
import { FetchStatus } from '@/utils/api';
import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const CURRENCIES_REFETCH_INTERVAL_MS = 10_000;

export function BankTransferController() {
    const location = useLocation();
    const intervalRef = useRef<any>(null);
    const [controllerReady, setControllerReady] = useState(false);

    const selectedMethod = useBankTransferStore(state => state.selectedMethod);
    const selectedCountry = useBankTransferStore(state => state.selectedCountry);
    const selectedCurrency = useBankTransferStore(state => state.selectedCurrency);

    const fields = useBankTransferRequiredFields(state => state.fields);
    const fieldsStatus = useBankTransferRequiredFields(state => state.status);

    const currencies = useBankTransferCurrenciesStore(state => state.bankTransferCurrencies);

    const startPooling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        const load = useBankTransferCurrenciesStore.getState().loadCurrencies;
        intervalRef.current = setInterval(load, CURRENCIES_REFETCH_INTERVAL_MS);
    };

    const stopPooling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        const loadCurrencies = useBankTransferCurrenciesStore.getState().loadCurrencies;
        const loadTransactions = useBankTransferStore.getState().loadTransactions;

        const initialize = async () => {
            if (currencies) {
                useBankTransferStore.getState().reset();
                useBankTransferRequiredFields.getState().reset();
                setControllerReady(true);
            }
            await Promise.all([
                loadCurrencies(),
                loadTransactions()
            ]);
            setControllerReady(true);
            startPooling();
        };

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                startPooling();
                await Promise.all([
                    loadCurrencies(),
                    loadTransactions()
                ]);
            } else {
                stopPooling();
            }
        };

        initialize();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            stopPooling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    if (location.pathname === '/bank-transfer/calculate' &&
        (!selectedCountry || !selectedCurrency || !selectedMethod)) {
        return <Navigate
            to="/bank-transfer"
            replace
        />;
    }
    if (location.pathname === '/bank-transfer/country' && !selectedMethod) {
        return <Navigate
            to="/bank-transfer"
            replace
        />;
    }
    if (location.pathname === '/bank-transfer/details' && !fields && fieldsStatus === FetchStatus.Idle) {
        return <Navigate
            to="/bank-transfer"
            replace
        />;
    }

    if (!controllerReady && !currencies) {
        return null;
    }

    return <Outlet />;
}