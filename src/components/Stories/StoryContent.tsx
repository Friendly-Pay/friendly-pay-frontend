import { Text } from '@/uikit';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './StoryContent.module.scss';

type StoryContentProps = {
    title: string
    text: string
    className?: string
    withIntroAnimation?: boolean;
}

const appearance = {
    initial: { y: 64, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.25, duration: 0.35, ease: [0.4, 0, 0.2, 1] }
};

export function StoryContent({ title, text, className, withIntroAnimation, children }: PropsWithChildren<StoryContentProps>) {
    const content = <>
        <Text
            type='headlineLarge'
            weight='bold'
            align='left'
            className={styles.title}
        >
            {title}
        </Text>
        <Text
            type='body'
            weight='regular'
            align='left'
            className={styles.text}
        >
            {text}
        </Text>
    </>;

    if (withIntroAnimation) {
        return (
            <motion.div
                {...appearance}
                className={classNames(styles.content, className)}
            >
                {content}
                {children}
            </motion.div>
        );
    }

    return (
        <div className={classNames(styles.content, className)}>
            {content}
            {children}
        </div>
    );
}