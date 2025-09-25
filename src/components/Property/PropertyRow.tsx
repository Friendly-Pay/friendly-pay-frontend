import { Text } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './PropertyRow.module.scss';

type PropertyRowProps = {
    label: string | ReactNode
    value: string | ReactNode
    className?: string
    onClick?: () => void
}

export function PropertyRow({ label, value, children, className, onClick }: PropsWithChildren<PropertyRowProps>) {
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
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