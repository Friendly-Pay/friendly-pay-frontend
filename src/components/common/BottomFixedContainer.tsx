import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './BottomFixedContainer.module.scss';

type BottomFixedContainerProps = {
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

export function BottomFixedContainer({ children, className }: PropsWithChildren<BottomFixedContainerProps>) {
    return createPortal(
        <motion.div
            {...loadingAppearance}
            className={classNames(styles.root, className)}
        >
            {children}
        </motion.div>,
        document.body
    );
}