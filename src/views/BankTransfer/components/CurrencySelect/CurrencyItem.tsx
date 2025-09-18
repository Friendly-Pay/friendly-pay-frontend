import { ArrowRight } from '@/components/Icons/Arrow';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './CurrencyItem.module.scss';

export type CurrencyItemProps = {
    icon: React.ReactNode;
    name: string;
    disabled?: boolean;
    className?: string;
    onClick: () => void;
};

export function CurrencyItem({ icon, name, disabled, onClick, className }: CurrencyItemProps) {
    const handleClick = () => {
        if (disabled) return;
        onClick();
    };

    return (
        <div
            className={classNames(styles.root, disabled && styles.disabled, className)}
            onClick={handleClick}
            aria-disabled={disabled}
        >
            <div className={styles.icon}>{icon}</div>
            <Text
                weight='regular'
                type='body'
                align='left'
                className={styles.label}
            >
                {name}
            </Text>
            {!disabled && <ArrowRight />}
        </div>
    );
}
