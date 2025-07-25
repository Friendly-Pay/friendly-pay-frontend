import { ModalContext } from '../Context';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ModalCloseButton.module.scss';

type ModalCloseButtonProps = {
    className?: string
    onClick?: () => void
}

export function ModalCloseButton({ className, onClick }: ModalCloseButtonProps) {
    const [t] = useTranslation();
    const context = useContext(ModalContext);
    const handleClick = () => {
        context.close?.();
        onClick?.();
    };

    return (
        <div
            className={classNames(styles.close, className)}
            onClick={handleClick}
        >
            {t('Close')}
        </div>
    );
}