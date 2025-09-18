import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './PageRoot.module.scss';

type PageRootProps = {
    className?: string
}

export function PageRoot({ className, children }: PropsWithChildren<PageRootProps>) {
    return (
        <div className={classNames(styles.root, className)}>
            {children}
        </div>
    );
}