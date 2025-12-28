import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './MainLayout.module.scss';

type MainLayoutProps = {
    fullSpace?: boolean
    fullHeight?: boolean
    className?: string
    onAnimationCompleted?: () => void
}

const appearance = {
    initial: {
        y: 1,
        opacity: 0
    },
    animate: {
        y: 0,
        opacity: 1
    },
    transition: {
        y: {
            ease: 'easeInOut',
            duration: 0.08
        },
        opacity: {
            duration: 0.15
        }
    }
};

export function MainLayout({ fullSpace, fullHeight, className, onAnimationCompleted, children }: PropsWithChildren<MainLayoutProps>) {
    return (
        <motion.div
            {...appearance}
            onAnimationComplete={onAnimationCompleted}
            className={classNames(styles.layout, fullHeight && styles.fullHeight, fullSpace && styles.fullSpace, className)}
        >
            {children}
        </motion.div>
    );
}