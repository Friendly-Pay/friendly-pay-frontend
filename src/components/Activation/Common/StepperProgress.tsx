import { ProgressStep } from './ProgressStep';
import { useLayoutEffect, useRef, useState } from 'react';
import styles from './StepperProgress.module.scss';

interface Step {
    icon: React.ReactNode;
    text: string;
};

type StepperProgressProps = {
    steps: [Step, Step, Step];
    isActivated: boolean
    isActivation: boolean
    isVerification: boolean
}

export function StepperProgress({ steps, isActivated, isActivation, isVerification }: StepperProgressProps) {
    const progressRef = useRef<HTMLDivElement>(null);
    const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [progress, setProgress] = useState(0);
    const [trackStyles, setTrackStyles] = useState({
        left: 0,
        width: 0
    });

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
    }, [isActivation, isVerification, isActivated]);

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

            {!isActivated && (
                <div
                    className={styles.trackGlow}
                    style={{
                        left: trackStyles.left + trackStyles.width * progress,
                    }}
                />
            )}

            <div className={styles.steps}>
                {steps.map((step, index) => {

                    let pending = false;
                    let completed = false;
                    if (index === 0) {
                        pending = isVerification;
                        completed = isActivation;
                    } else if (index === 1) {
                        pending = isActivation;
                        completed = isActivated;
                    } else if (index === 2) {
                        pending = isActivated;
                        completed = false;
                    }

                    return (
                        <ProgressStep
                            key={index}
                            ref={el => (stepsRefs.current[index] = el)}
                            icon={step.icon}
                            pending={pending}
                            completed={completed}
                        >
                            {step.text}
                        </ProgressStep>
                    );
                })}
            </div>
        </div>
    );
}