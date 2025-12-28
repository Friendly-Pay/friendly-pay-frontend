import virtual1 from 'assets/cards/virtual_1.png?inline';
import virtual2 from 'assets/cards/virtual_2.png?inline';
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
    [111018]: {
        design: virtual1
    },
    /** @deprecated */
    [111021]: {
        design: virtual1,
        border: '1px solid #313133',
        previewBorder: '1px solid #313133'
    },
    [111028]: {
        // inverse: true,
        design: virtual2,
        border: '1px solid #313133',
        previewBorder: '1px solid #313133'
    },
    [111033]: {
        design: virtual1,
        border: '1px solid #313133',
        previewBorder: '1px solid #313133'
    }
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