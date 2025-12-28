import { Spinner } from '@/uikit';
import { ButtonHTMLAttributes, forwardRef, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { mergeRefs } from 'react-merge-refs';
import classNames from 'classnames';
import styles from './ActionButton.module.scss';

type ComponentProps = {
    icon: ReactNode
    loading?: boolean
    disabled?: boolean
    className?: string
    onClick?: () => void
}

type ActionButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;

// @TODO touch анимация и задержка обработки клика (для воспроизведения анимации)
// Можно сделать такой компонент обертку для всех кликабельных кнопок / элементов
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    (
        {
            className,
            icon,
            children,
            type = 'button',
            disabled,
            loading,
            onClick,
            ...rest
        },
        ref,
    ) => {
        const [t] = useTranslation();
        const componentRef = useRef<HTMLButtonElement>(null);

        const framerId = useRef(0);

        useEffect(() => {
            return () => {
                framerId.current && cancelAnimationFrame(framerId.current);
            };
        }, []);

        const handleClick = () => {
            framerId.current = requestAnimationFrame(() => onClick?.());
        };

        const buttonChildren = (
            <>
                <span
                    role='img'
                    className={styles.icon}
                >
                    {loading ? (
                        <Spinner className={styles.spinner} />
                    ) : (
                        icon
                    )}
                </span>

                <span className={styles.text}>
                    {loading
                        ? t('Loading...')
                        : children}
                </span>
            </>
        );

        return (
            <button
                ref={mergeRefs([componentRef, ref])}
                type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
                onClick={handleClick}

                disabled={disabled || loading}
                className={classNames(styles.button, loading && styles.loading, disabled && styles.disabled, className)}
                {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
            >
                {buttonChildren}
            </button>
        );
    }
);