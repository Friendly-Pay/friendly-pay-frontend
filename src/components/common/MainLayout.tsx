import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './MainLayout.module.scss';

type MainLayoutProps = {
    fullSpace?: boolean
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
        duration: 0.3
    }
};

export function MainLayout({ fullSpace, className, children }: PropsWithChildren<MainLayoutProps>) {
    return (
        <motion.div
            id='mainLayout'
            {...appearance}
            className={classNames(styles.layout, fullSpace && styles.fullSpace, className)}
        >
            {children}
        </motion.div>
    );
}