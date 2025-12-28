import { SumsubFailed } from './components/SumsubFailed';
import { SumsubNeedAction } from './components/SumsubNeedAction';
import { SumsubPending } from './components/SumsubPending';
import { SumsubStart } from './components/SumsubStart';
import { SumsubSuccess } from './components/SumsubSuccess';
import { SumsubContext, TSumsubContext } from './context';
import { useUserVerificationPooling } from './hooks/useUserVerificationPooling';
import { SumsubIcons, SumsubTexts } from './types';
import { MainLayout } from '@/components/common/MainLayout';
import { Routes } from '@/routes';
import { usePaymentStore } from '@/states/payment/store';
import { useSumsubStore } from '@/states/sumsub/store';
import { VerificationStatus } from '@/states/user/store';
import { openTelegramLink, openWebviewLink } from '@/utils';
import kycFailed from 'assets/kyc_failed.png';
import kycPending from 'assets/kyc_pending.png';
import kycStart from 'assets/kyc_start.png';
import kycSuccess from 'assets/kyc_success.png';
import { ComponentType, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './SumsubView.module.scss';

const sumsubScreens: Record<string, ComponentType> = {
    [VerificationStatus.Idle]: SumsubStart,
    [VerificationStatus.Pending]: SumsubPending,
    [VerificationStatus.Success]: SumsubSuccess,
    [VerificationStatus.NeedAction]: SumsubNeedAction,
    [VerificationStatus.Failed]: SumsubFailed
};

export function SumsubView() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const serverError = useSumsubStore(state => state.serverError);
    const selectedCardTypeId = useSumsubStore(state => state.selectedCardTypeId);
    const sumsubLinkFetchStatus = useSumsubStore(state => state.sumsubLinkFetchStatus);

    // Выбранная карта, после прохождения KYC - пользователь перейдет сразу к покупке
    const cardTypeId = selectedCardTypeId;

    const [verificationStatus, startPooling] = useUserVerificationPooling();

    useEffect(() => {
        const poolingStatuses = [VerificationStatus.Pending, VerificationStatus.NeedAction];
        if (poolingStatuses.includes(verificationStatus)) {
            startPooling();
        }
    }, [verificationStatus]);

    useEffect(() => {
        if (serverError) {
            const toastId = toast.error(serverError);
            return () => {
                toast.dismiss(toastId);
            };
        }
    }, [serverError]);

    const handleOpenSumsub = async () => {
        const { sumsubLink, loadSumsubLink } = useSumsubStore.getState();
        let openLink = sumsubLink;

        // Загружаем ссылку, если её ещё нет
        if (!openLink) {
            await loadSumsubLink(cardTypeId);
            openLink = useSumsubStore.getState().sumsubLink;
        }
        if (!openLink) {
            return;
        }

        startPooling();
        openWebviewLink(openLink);
    };

    const handleOpenSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    const handleOpenCardPurchase = () => {
        if (verificationStatus === VerificationStatus.Success) {
            if (cardTypeId) {
                usePaymentStore.getState().startCardPurchase(cardTypeId);
                navigate(Routes.CARD_PURCHASE);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const sumsubTexts: SumsubTexts = useMemo(() => {
        return {
            idleTitle: t('Verification required'),
            idleDescription: t('We’ll ask you for documents, a selfie, and address confirmation'),
            idleButton: t('Start'),
            idleReadyTitle: t('Great, now continue'),
            idleReadyButton: t('Continue'),
            cancelButton: t('Cancel'),
            pendingTitle: t('Checking documents'),
            pendingDescription: t('Once the verification is complete, we’ll send you a notification'),
            successTitle: t('Verification completed'),
            successDescription: t('We’ve checked your documents.<br/>Everything is in order'),
            successButton: t('Continue'),
            needActionTitle: t('Document error'),
            needActionDescription: t('To complete verification, please review your documents'),
            needActionButton: t('View'),
            failedTitle: t('Verification failed'),
            failedDescription: t('We couldn’t verify your information. Please contact support'),
            failedButton: t('Support'),
        };
    }, [t]);

    const sumsubIcons: SumsubIcons = useMemo(() => {
        return {
            idle: kycStart,
            pending: kycPending,
            success: kycSuccess,
            needAction: kycFailed,
            failed: kycFailed
        };
    }, []);

    const contextValue: TSumsubContext = {
        texts: sumsubTexts,
        icons: sumsubIcons,
        cardTypeId: cardTypeId || 0,
        verificationStatus,
        sumsubLinkFetchStatus,
        handleKycStart: handleOpenSumsub,
        handleKycRepeat: handleOpenSumsub,
        handleOpenSupport: handleOpenSupport,
        handleOpenCardPurchase: handleOpenCardPurchase,
        handleCancel: handleCancel
    };

    const CurrentScreen = sumsubScreens[verificationStatus];

    return (
        <SumsubContext.Provider value={contextValue}>
            <MainLayout
                fullHeight
                key={verificationStatus}
                className={styles.layout}
            >
                {CurrentScreen && <CurrentScreen />}
            </MainLayout>
        </SumsubContext.Provider>
    );
}