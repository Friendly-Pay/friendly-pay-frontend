import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './MainLayout.module.scss';

type MainLayoutProps = {
    fullSpace?: boolean
    fullHeight?: boolean
    className?: string
}

const appearance = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1
    },
    transition: {
        ease: 'easeInOut',
        duration: 0.2
    }
};

export function MainLayout({ fullSpace, fullHeight, className, children }: PropsWithChildren<MainLayoutProps>) {
    return (
        <motion.div
            // id='mainLayout'
            {...appearance}
            className={classNames(styles.layout, fullHeight && styles.fullHeight, fullSpace && styles.fullSpace, className)}
        >
            {children}
        </motion.div>
    );
}