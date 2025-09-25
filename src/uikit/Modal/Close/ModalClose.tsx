import { ModalContext } from '../Context';
import { CircleCloseButton } from '@/uikit/Button/CircleCloseButton';
import { useContext } from 'react';
import classNames from 'classnames';
import styles from './ModalClose.module.scss';

type ModalCloseProps = {
    className?: string
    onClick?: () => void
}

export function ModalClose({ className, onClick }: ModalCloseProps) {
    const context = useContext(ModalContext);
    const handleClick = () => {
        context.close?.();
        onClick?.();
    };

    return (
        <CircleCloseButton
            className={classNames(styles.cross, className)}
            onClick={handleClick}
        />
    );
}