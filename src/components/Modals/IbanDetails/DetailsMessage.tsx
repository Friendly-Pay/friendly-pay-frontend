import { ClockFill } from '@/components/Icons/Clock';
import { Text } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './DetailsMessage.module.scss';

type DetailsMessageProps = {
    icon?: ReactNode
    className?: string
}

export function DetailsMessage({ icon, className, children }: PropsWithChildren<DetailsMessageProps>) {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.content}>
                {icon && <div className={styles.icon}>
                    <ClockFill />
                </div>}
                <Text
                    type='body'
                    align='left'
                    weight='medium'
                    className={styles.text}
                >
                    {children}
                </Text>
            </div>
        </div>
    );
}