import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

type StageRootProps = {
    className?: string
}

const stageAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
};

export function StageRoot({ className, children }: PropsWithChildren<StageRootProps>) {
    return (
        <motion.div
            {...stageAppearance}
            className={className}
        >
            {children}
        </motion.div>
    );
}