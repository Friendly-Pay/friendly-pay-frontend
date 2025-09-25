import { PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './SlimActionButton.module.scss';

type SlimActionButtonProps = {
    icon: ReactNode
    disabled?: boolean
    className?: string
    onClick?: () => void
}

// @TODO touch анимация и задержка обработки клика (для воспроизведения анимации)
// Можно сделать такой компонент обертку для всех кликабельных кнопок / элементов
export function SlimActionButton({ icon, className, disabled, children, onClick }: PropsWithChildren<SlimActionButtonProps>) {
    return (
        <div
            className={classNames(styles.button, disabled && styles.disabled, className)}
            onClick={onClick}
        >
            <div className={styles.icon}>
                {icon}
            </div>

            <div className={styles.text}>
                {children}
            </div>
        </div>
    );
}