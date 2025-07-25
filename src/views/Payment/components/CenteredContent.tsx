import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './CenteredContent.module.scss';

type CenteredContentProps = {
    className?: string
}

export function CenteredContent({ className, children }: PropsWithChildren<CenteredContentProps>) {
    return (<div className={classNames(styles.content, className)}>
        {children}
    </div>);
}