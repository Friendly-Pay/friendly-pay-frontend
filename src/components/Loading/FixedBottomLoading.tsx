import { Spinner, Text } from '@/uikit';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './FixedBottomLoading.module.scss';

type FixedBottomLoadingProps = {
    text: string
    className?: string
}

const loadingAppearance = {
    initial: {
        y: '100%',
        opacity: 0
    },
    animate: {
        y: '0%',
        opacity: 1
    },
    exit: {
        y: '100%',
        opacity: 0
    },
    transition: { ease: [0.27, 0, 0, 0.9], duration: 0.3 }
};

/** @deprecated */
export function FixedBottomLoading({ text, className, children }: PropsWithChildren<FixedBottomLoadingProps>) {
    return (
        <motion.div
            {...loadingAppearance}
            className={classNames(styles.root, className)}
        >
            <div className={styles.spinner}>
                <Spinner />
            </div>

            <Text
                type='body'
                weight='semibold'
                className={styles.text}
            >
                {text}
            </Text>

            {children}
        </motion.div>
    );
}