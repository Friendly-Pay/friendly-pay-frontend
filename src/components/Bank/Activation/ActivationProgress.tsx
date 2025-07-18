import { StepperProgress } from './StepperProgress';
import { Clock } from '@/components/Icons/Clock';
import { CardStatus } from '@/states/cards/store';
import { Button, Text } from '@/uikit';
import { openTelegramLink } from '@/utils';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ActivationProgress.module.scss';

type ActivationProgressProps = {
    status: CardStatus
    className?: string
}

export function ActivationProgress({ status, className }: ActivationProgressProps) {
    const [t] = useTranslation();
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

    const prevStatus = useRef<CardStatus>(status);
    useEffect(() => {
        if (prevStatus.current === status) {
            return;
        }
        prevStatus.current = status;
        if (isFailed) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        } else {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }, [status]);

    const openSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.head}>
                <div className={styles.label}>
                    <div className={styles.icon}><Clock /> </div>
                    <Text
                        type='captionSmall'
                        weight='semibold'
                        className={styles.text}
                    >
                        {t('Card activation')}
                    </Text>
                </div>
                {minutes && <Text
                    type='captionSmall'
                    weight='semibold'
                    className={styles.text}
                >
                    {t('≈ {{minutes}} min', { minutes })}
                </Text>}
            </div>

            <Text
                type='body'
                weight='semibold'
                align='left'
                className={classNames(styles.title, isFailed && styles.danger)}
                dangerouslySetInnerHTML={{ __html: text }}
            />

            {isFailed
                ? <Button
                    view='secondary'
                    className={styles.supportButton}
                    onClick={openSupport}
                >
                    {t('Contact support')}
                </Button>
                : <StepperProgress cardStatus={status} />}
        </div >
    );
}