import { AddressStage } from './components/Address/AddressStage';
import { EmailStage } from './components/EmailStage';
import { PhoneStage } from './components/PhoneStage';
import { PreloadingStage } from './components/PreloadingStage';
import { MainLayout } from '@/components/common/MainLayout';
import { useSupportedCitiesStore } from '@/states/verification/city';
import { useSupportedCountriesStore } from '@/states/verification/country';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function VerificationView() {
    const stage = useVerificationStore(state => state.stage);
    const cardId = useVerificationStore(state => state.data.cardId);
    const clearSupportedCities = useSupportedCitiesStore(state => state.clear);

    useEffect(() => {
        if (!cardId) return;
        const minLoaderTimeMs = 700;

        let timeout: any;
        const preload = async () => {
            const start = performance.now();
            const loadSupportedCountries = useSupportedCountriesStore.getState().load;
            const loadSupportedCities = useSupportedCitiesStore.getState().load;
            const { setStage, loadInitialCountryCode } = useVerificationStore.getState();
            await Promise.all([
                loadSupportedCities(),
                loadSupportedCountries(),
                loadInitialCountryCode()
            ]);
            const elapsed = performance.now() - start;
            const wait = minLoaderTimeMs - elapsed;
            if (wait > 0) {
                timeout = setTimeout(() => setStage(VerificationStage.PersonalData), wait);
            } else {
                setStage(VerificationStage.PersonalData);
            }
        };
        preload();

        return () => {
            if (timeout) clearTimeout(timeout);
            clearSupportedCities();
        };
    }, []);

    if (!cardId) {
        return <Navigate
            to='/'
            replace
        />;
    }

    return (
        <MainLayout>
            {stage === VerificationStage.Preloading && <PreloadingStage />}
            {stage === VerificationStage.PersonalData && <AddressStage />}
            {stage === VerificationStage.Address && <AddressStage />}
            {stage === VerificationStage.Email && <EmailStage />}
            {stage === VerificationStage.PhoneNumber && <PhoneStage />}
        </MainLayout>
    );
}