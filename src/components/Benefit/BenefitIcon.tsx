import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './BenefitIcon.module.scss';

type BenefitIconProps = {
    className?: string
}

export function BenefitIcon({ className, children }: PropsWithChildren<BenefitIconProps>) {
    return (
        <div className={classNames(styles.icon, className)}>
            {children}
        </div>
    );
}