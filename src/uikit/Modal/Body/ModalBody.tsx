import { ModalContext } from '../Context';
import { HTMLAttributes, PropsWithChildren, useContext } from 'react';
import classNames from 'classnames';
import styles from './ModalBody.module.scss';

export function ModalBody({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    const context = useContext(ModalContext);

    return (
        <div
            ref={context.bodyRef}
            className={classNames(styles.body, className)}
            {...props}
        >
            {children}
        </div>
    );
}