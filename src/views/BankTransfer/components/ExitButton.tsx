import { useBankTransferStore } from '../state/store';
import { CloseFill } from '@/components/Icons/Close';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ExitButton.module.scss';

type ExitButtonProps = {
    className?: string
}

export function ExitButton({ className }: ExitButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
        useBankTransferStore.getState().reset();
    };
    return (
        <div
            className={classNames(styles.cross, className)}
            onClick={handleClick}
        >
            <CloseFill />
        </div>
    );
}