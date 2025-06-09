import { Spinner } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './MainButton.module.scss';

type MainButtonProps = {
    icon: ReactNode
    loading?: boolean
    disabled?: boolean
    className?: string
    onClick?: () => void
}

export function MainButton({ icon, className, loading, disabled, children, onClick }: PropsWithChildren<MainButtonProps>) {
    const [t] = useTranslation();
    return (
        <div
            className={classNames(styles.button, loading && styles.loading, disabled && styles.disabled, className)}
            onClick={onClick}
        >
            <div className={styles.icon}>
                {loading
                    ? <div className={styles.spinner}><Spinner /></div>
                    : icon}
            </div>

            <div className={styles.text}>
                {loading
                    ? t('Loading...')
                    : children}
            </div>
        </div>
    );
}