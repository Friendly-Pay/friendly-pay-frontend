import { Text } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './TxProperty.module.scss';

type TxPropertyProps = {
    label: string | ReactNode
    value: string | ReactNode
    className?: string
}

export function TxProperty({ label, value, children, className }: PropsWithChildren<TxPropertyProps>) {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.content}>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.label}
                >
                    {label}
                </Text>
                <Text
                    type='body'
                    align='left'
                    weight='medium'
                    className={styles.value}
                >
                    {value}
                </Text>
            </div>
            {children}
        </div>
    );
}