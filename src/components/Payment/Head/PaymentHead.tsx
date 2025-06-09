import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './PaymentHead.module.scss';

type PaymentHeadProps = {
    className?: string
}

export function PaymentHead({ className, children }: PropsWithChildren<PaymentHeadProps>) {
    return (
        <div className={classNames(styles.head, className)}>
            {children}
        </div>
    );
}