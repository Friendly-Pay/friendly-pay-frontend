import { Text } from '@/uikit';
import { forwardRef, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './ProgressStep.module.scss';

type ProgressStepProps = {
    icon: ReactNode;
    pending?: boolean;
    completed?: boolean;
    className?: string;
};

// @TODO эффект pending
export const ProgressStep = forwardRef<
    HTMLDivElement,
    PropsWithChildren<ProgressStepProps>
>(({ icon, pending, completed, children, className }, ref) => (
    <div
        ref={ref}
        className={classNames(
            styles.root,
            pending && styles.pending,
            completed && styles.completed,
            className
        )}
    >
        <div className={styles.icon}>
            <div className={styles.background}></div>
            <div className={styles.svg}>{icon}</div>
        </div>
        <Text
            weight="regular"
            align="center"
            className={styles.text}
        >
            {children}
        </Text>
    </div>
));

ProgressStep.displayName = 'ProgressStep';