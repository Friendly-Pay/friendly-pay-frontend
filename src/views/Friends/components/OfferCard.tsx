import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './OfferCard.module.scss';

type OfferCardProps = {
    style?: CSSProperties
    className?: string
    onClick?: () => void
}

export function OfferCard({ children, style, className, onClick }: PropsWithChildren<OfferCardProps>) {
    return (
        <div
            className={classNames(styles.card, className)}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
}