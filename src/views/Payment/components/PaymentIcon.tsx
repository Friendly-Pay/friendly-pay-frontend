import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './PaymentIcon.module.scss';

type PaymentIconProps = {
    className?: string
}

export function PaymentIcon({ className, children }: PropsWithChildren<PaymentIconProps>) {
    return (
        <div className={classNames(styles.icon, className)}>
            {children}
        </div>
    );
}