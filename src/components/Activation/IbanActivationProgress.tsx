import { Bank } from '../Icons/Bank';
import { ActivationProgress } from './Common/ActivationProgress';
import { StepperProgress } from './Common/StepperProgress';
import { Clock } from '@/components/Icons/Clock';
import { Heart } from '@/components/Icons/Heart';
import { Passport } from '@/components/Icons/Passport';
import { IbanStatus, IbanVerificationStatus } from '@/states/iban/store';
import { Button } from '@/uikit';
import { openTelegramLink } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './IbanActivationProgress.module.scss';

type IbanActivationProgressProps = {
    status: IbanStatus
    verificationStatus: IbanVerificationStatus
    className?: string
}

export function IbanActivationProgress({ status, verificationStatus, className }: IbanActivationProgressProps) {
    const [t] = useTranslation();
    const navigate = useNavigate();

    const isVerification = verificationStatus === IbanVerificationStatus.InProgress;
    const isActivation = status === IbanStatus.InProgress;
    const isActivated = status === IbanStatus.Activated;
    const isNeedAction = verificationStatus === IbanVerificationStatus.NeedAction;
    const isFailed = status === IbanStatus.Failed || verificationStatus === IbanVerificationStatus.Failed || isNeedAction;

    let text: any;
    if (isFailed) {
        if (isNeedAction) {
            text = t('We detected an error while verifying your data. Please upload your documents again');
        } else {
            text = t('We have paused the account opening. Contact us to continue');
        }
    }

    const openSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    const openKyc = () => {
        navigate('/sumsub/bank-account');
    };

    let actionButton: any = null;
    if (isFailed) {
        if (isNeedAction) {
            actionButton = <Button
                view='secondary'
                className={styles.button}
                onClick={openKyc}
            >
                {t('Retry')}
            </Button>;
        } else {
            actionButton = <Button
                view='secondary'
                className={styles.button}
                onClick={openSupport}
            >
                {t('Contact support')}
            </Button>;
        }
    }

    return (
        <ActivationProgress
            label={t('Account opening')}
            icon={<Clock />}
            text={text}
            textDanger={isFailed}
            className={className}
        >
            <div className={styles.content}>
                {actionButton}
                {!isFailed && <StepperProgress
                    steps={[
                        { icon: <Passport />, text: t('Verifying') },
                        { icon: <Bank />, text: t('Activating') },
                        { icon: <Heart />, text: t('Account is ready') }
                    ]}
                    isActivated={isActivated}
                    isActivation={isActivation}
                    isVerification={isVerification}
                />}
            </div>
        </ActivationProgress>
    );
}