import { ActivationProgress } from './Common/ActivationProgress';
import { StepperProgress } from './Common/StepperProgress';
import { BankCardV2 } from '@/components/Icons/BankCard';
import { Clock } from '@/components/Icons/Clock';
import { Heart } from '@/components/Icons/Heart';
import { Passport } from '@/components/Icons/Passport';
import { CardStatus } from '@/states/cards/store';
import { Button } from '@/uikit';
import { openTelegramLink } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './CardActivationProgress.module.scss';

type CardActivationProgressProps = {
    status: CardStatus
    className?: string
}

export function CardActivationProgress({ status, className }: CardActivationProgressProps) {
    const [t] = useTranslation();

    const isActivation = status === CardStatus.ActivationProcessing;
    const isVerification = status === CardStatus.VerificationProcessing;
    const isActivated = !isActivation && !isVerification;
    const isFailed = status === CardStatus.VerificationFailed || status === CardStatus.ActivationFailed;

    let text: any;
    if (status === CardStatus.ActivationProcessing) {
        text = t('Almost ready, waiting for<br/> confirmation from the bank...');
    } else if (status === CardStatus.VerificationProcessing) {
        text = t('Reviewing your documents,<br/> and moving on...');
    } else if (status === CardStatus.VerificationFailed) {
        text = t('We encountered an error while verifying your data. Please contact support');
    } else if (status === CardStatus.ActivationFailed) {
        text = t('We encountered an error while verifying your data. Please contact support');
    }

    let minutes: any;
    if (status === CardStatus.VerificationProcessing) {
        minutes = 3;
    } else if (status === CardStatus.ActivationProcessing) {
        minutes = 10;
    }

    const openSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    return (
        <ActivationProgress
            label={t('Card activation')}
            icon={<Clock />}
            text={text}
            textDanger={isFailed}
            minutes={minutes}
            className={className}
        >
            {isFailed
                ? <Button
                    view='secondary'
                    className={styles.supportButton}
                    onClick={openSupport}
                >
                    {t('Contact support')}
                </Button>
                : <StepperProgress
                    steps={[
                        { icon: <Passport />, text: t('Verifying') },
                        { icon: <BankCardV2 />, text: t('Activating') },
                        { icon: <Heart />, text: t('Card is ready') }
                    ]}
                    isActivated={isActivated}
                    isActivation={isActivation}
                    isVerification={isVerification}
                />}
        </ActivationProgress>
    );
}