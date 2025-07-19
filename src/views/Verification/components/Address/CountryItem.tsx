import { ArrowRight } from '@/components/Icons/Arrow';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './CountryItem.module.scss';

export interface CountryItemProps {
    emoji: string;
    label: string;
    className?: string;
    onClick: () => void;
}

export function CountryItem({
    emoji,
    label,
    onClick,
    className,
}: CountryItemProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.emoji}>
                {emoji}
            </div>
            <Text
                weight='regular'
                type='body'
                align='left'
                className={styles.label}
            >
                {label}
            </Text>
            <ArrowRight />
        </div>
    );
}