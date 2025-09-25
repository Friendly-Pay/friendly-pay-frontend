import { Spinner } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ActionButton.module.scss';

type ActionButtonProps = {
    icon: ReactNode
    loading?: boolean
    disabled?: boolean
    className?: string
    onClick?: () => void
}

// @TODO touch анимация и задержка обработки клика (для воспроизведения анимации)
// Можно сделать такой компонент обертку для всех кликабельных кнопок / элементов
export function ActionButton({ icon, className, loading, disabled, children, onClick }: PropsWithChildren<ActionButtonProps>) {
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