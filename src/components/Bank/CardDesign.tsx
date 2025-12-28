import axtCard from 'assets/cards/axt_card.png?inline';
import axtVirtual from 'assets/cards/axt_virtual.png?inline';
import axtVirtual2 from 'assets/cards/axt_virtual_2.png?inline';
import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './CardDesign.module.scss';

type CardDesignProps = {
    cardTypeId: number
    preview?: boolean
    className?: string
    backgroundClassName?: string
    style?: CSSProperties
    onClick?: () => void
}

export const cardDesign = {
    /** @deprecated */
    [100008]: {
        design: axtCard,
    },
    /** @deprecated */
    [100005]: {
        design: axtCard
    },
    /** @deprecated */
    [100004]: {
        design: axtCard
    },
    /** @deprecated */
    [100010]: {
        design: axtCard
    },
    /** @deprecated */
    [111018]: {
        design: axtVirtual
    },
    /** @deprecated */
    [111021]: {
        design: axtVirtual2
    },
    [111028]: {
        design: axtCard
    },
} as const;

export function CardDesign({ cardTypeId, preview, style, className, backgroundClassName, children, onClick }: PropsWithChildren<CardDesignProps>) {
    const data = cardDesign[cardTypeId as keyof typeof cardDesign];

    if (!data) {
        console.error(`[cardDesign] typeId ${cardTypeId} unknown`);
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