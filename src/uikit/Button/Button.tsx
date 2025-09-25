import { Spinner } from '../Spinner';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = {
    view?: 'primary' | 'secondary' | 'secondaryColored' | 'white' | 'transparent';
    loading?: boolean;
    disabled?: boolean;
    smallSize?: boolean;
    className?: string;
    onClick?: (event: any) => void;
}

export function Button({ view = 'primary', smallSize, loading, disabled, className, children, onClick }: PropsWithChildren<ButtonProps>) {
    const isLoading = !disabled && loading;
    const handleClick = (event: any) => {
        if (isLoading || disabled) {
            event.preventDefault();
            return;
        }
        onClick?.(event);
    };

    return (
        <button
            className={classNames(
                styles.button,
                styles[view],
                loading && styles.loading,
                disabled && styles.disabled,
                smallSize && styles.smallSize,
                className
            )}
            onClick={handleClick}
        >
            {loading ? (
                <div className={styles.loader}>
                    {<Spinner />}
                </div>
            ) : (
                children
            )}
        </button>
    );
}