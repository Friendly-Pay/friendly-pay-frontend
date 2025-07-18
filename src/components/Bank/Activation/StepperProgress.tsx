import { ProgressStep } from './ProgressStep';
import { BankCardV2 } from '@/components/Icons/BankCard';
import { Heart } from '@/components/Icons/Heart';
import { Passport } from '@/components/Icons/Passport';
import { CardStatus } from '@/states/cards/store';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StepperProgress.module.scss';

type StepperProgressProps = {
    cardStatus: CardStatus
}

export function StepperProgress({ cardStatus }: StepperProgressProps) {
    const [t] = useTranslation();
    const progressRef = useRef<HTMLDivElement>(null);
    const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [progress, setProgress] = useState(0);
    const [trackStyles, setTrackStyles] = useState({
        left: 0,
        width: 0
    });

    const isActivation = cardStatus === CardStatus.ActivationProcessing;
    const isVerification = cardStatus === CardStatus.VerificationProcessing;
    const isActivated = !isActivation && !isVerification;

    useLayoutEffect(() => {
        const container = progressRef.current;
        if (!stepsRefs.current.length || !container) return;

        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;

        const centers = stepsRefs.current.map(c => {
            const r = c!.getBoundingClientRect();
            return r.left + r.width / 2 - containerLeft;
        });

        const left = centers[0];
        const full = centers[centers.length - 1] - left;
        setTrackStyles({ left, width: full });

        const seg1 = centers[1] - centers[0];
        const seg2 = centers[2] - centers[1];

        let w = 0;
        if (isVerification) w = (seg1 + 6) * 0.5;
        else if (isActivation) w = (seg1 + 6) + seg2 * 0.5;
        else w = seg1 + seg2;
        setProgress(full > 0 ? w / full : 0);
    }, [cardStatus]);

    return (
        <div
            ref={progressRef}
            className={styles.progress}
        >
            <div
                className={styles.track}
                style={{ left: trackStyles.left, width: trackStyles.width }}
            />

            <div
                className={styles.trackFill}
                style={{
                    left: trackStyles.left,
                    width: trackStyles.width,
                    transform: `scaleX(${progress})`,
                }}
            />

            <div className={styles.steps}>
                <ProgressStep
                    ref={el => (stepsRefs.current[0] = el)}
                    icon={<Passport />}
                    pending={isVerification}
                    completed={isActivation}
                >
                    {t('Verifying')}
                </ProgressStep>

                <ProgressStep
                    ref={el => (stepsRefs.current[1] = el)}
                    icon={<BankCardV2 />}
                    pending={isActivation}
                    completed={isActivated}
                >
                    {t('Activating')}
                </ProgressStep>

                <ProgressStep
                    ref={el => (stepsRefs.current[2] = el)}
                    icon={<Heart />}
                    pending={isActivated}
                >
                    {t('Card is ready')}
                </ProgressStep>
            </div>
        </div>
    );
}