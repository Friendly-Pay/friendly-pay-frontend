import axtCard from 'assets/cards/axt_card.png?inline';
import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './CardDesign.module.scss';

type CardDesignProps = {
    typeId: number
    preview?: boolean
    className?: string
    backgroundClassName?: string
    style?: CSSProperties
    onClick?: () => void
}

export const cardDesign = {
    [100008]: {
        design: axtCard,
    },
    [100005]: {
        design: axtCard
    },
    [100004]: {
        design: axtCard
    },
    [100010]: {
        design: axtCard
    }
} as const;

export function CardDesign({ typeId, preview, style, className, backgroundClassName, children, onClick }: PropsWithChildren<CardDesignProps>) {
    const data = cardDesign[typeId as keyof typeof cardDesign];
    if (!data) {
        console.warn(`[cardDesign] typeId ${typeId} unknown`);
        return null;
    }

    let border: any;
    if (preview && 'previewBorder' in data) {
        border = data.previewBorder;
    } else if ('border' in data) {
        border = data.border;
    }

    let inverse: any = 'inverse' in data ? data.inverse : undefined;
    if (!inverse) {
        inverse = false;
    }

    return (
        <div
            className={classNames(styles.card, inverse && styles.inverse, className)}
            style={style}
            onClick={onClick}
        >
            <div
                className={backgroundClassName}
                style={{ backgroundImage: `url(${data.design})`, border }}
            ></div>

            {children}
        </div>
    );
}