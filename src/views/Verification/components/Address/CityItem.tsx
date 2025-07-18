import { ArrowRight } from '@/components/Icons/Arrow';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './CountryItem.module.scss';

export interface CountryItemProps {
    label: string;
    className?: string;
    onClick: () => void;
}

export function CityItem({
    label,
    onClick,
    className,
}: CountryItemProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
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