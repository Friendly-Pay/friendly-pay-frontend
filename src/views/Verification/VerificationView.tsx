import { AddressStage } from './components/Address/AddressStage';
import { EmailStage } from './components/EmailStage';
import { PersonalDataStage } from './components/PersonalDataStage';
import { PhoneStage } from './components/PhoneStage';
import { PreloadingStage } from './components/PreloadingStage';
import { MainLayout } from '@/components/common/MainLayout';
import { useSupportedCountriesStore } from '@/states/verification/country';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function VerificationView() {
    const stage = useVerificationStore(state => state.stage);
    const cardId = useVerificationStore(state => state.data.cardId);

    useEffect(() => {
        if (!cardId) return;
        const preload = async () => {
            const loadSupportedCountries = useSupportedCountriesStore.getState().load;
            const { setStage, loadInitialCountryCode } = useVerificationStore.getState();
            await Promise.all([
                loadSupportedCountries(),
                loadInitialCountryCode()
            ]);
            setStage(VerificationStage.PersonalData);
        };
        preload();
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
            {stage === VerificationStage.PersonalData && <PersonalDataStage />}
            {stage === VerificationStage.Address && <AddressStage />}
            {stage === VerificationStage.Email && <EmailStage />}
            {stage === VerificationStage.PhoneNumber && <PhoneStage />}
        </MainLayout>
    );
}