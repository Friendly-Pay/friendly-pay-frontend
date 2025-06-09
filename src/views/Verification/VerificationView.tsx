import { ConfirmStage } from './components/ConfirmStage';
import { CountryStage } from './components/CountryStage';
import { FailedStage } from './components/FailedStage';
import { IntroStage } from './components/IntroStage';
import { PersonalDataStage } from './components/PersonalDataStage';
import { PhoneStage } from './components/PhoneStage';
import { SuccessStage } from './components/SuccessStage';
import { MainLayout } from '@/components/common/MainLayout';
import { useUserStore } from '@/states/user/store';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Navigate } from 'react-router-dom';

export function VerificationView() {
    const stage = useVerificationStore(state => state.stage);
    const userVerificationLevel = useUserStore(state => state.user!.verificationLevel);

    if (userVerificationLevel !== 'None') {
        return <Navigate
            to='/'
            replace
        />;
    }

    return (
        <MainLayout>
            {stage === VerificationStage.Intro && <IntroStage />}
            {stage === VerificationStage.PhoneNumber && <PhoneStage />}
            {stage === VerificationStage.PersonalData && <PersonalDataStage />}
            {stage === VerificationStage.Country && <CountryStage />}
            {stage === VerificationStage.NeedConfirm && <ConfirmStage />}
            {stage === VerificationStage.Success && <SuccessStage />}
            {stage === VerificationStage.Failed && <FailedStage />}
        </MainLayout>
    );
}