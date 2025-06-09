import { Text } from '@/uikit/Text';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './ModalTitle.module.scss';

type ModalTitleProps = {
    align?: 'left' | 'center' | 'right'
    className?: string
}

export function ModalTitle({ align, children, className }: PropsWithChildren<ModalTitleProps>) {
    return (
        <Text
            type='title'
            align={align}
            className={classNames(styles.title, className)}
        >
            {children}
        </Text>
    );
}