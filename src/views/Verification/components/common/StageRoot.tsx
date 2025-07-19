import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './StageRoot.module.scss';

type StageRootProps = {
    initial?: boolean
    className?: string
}

const stageAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
};

const stageInitial = {
    initial: false
};

export function StageRoot({ initial = true, className, children }: PropsWithChildren<StageRootProps>) {
    return (
        <motion.div
            {...(initial
                ? stageAppearance
                : stageInitial
            )}
            className={classNames(styles.stage, className)}
        >
            {children}
        </motion.div>
    );
}