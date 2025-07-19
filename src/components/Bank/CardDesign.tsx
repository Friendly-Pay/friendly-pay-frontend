import seamlessVirtual from 'assets/cards/seamless_virtual.png?inline';
import secondVirtual from 'assets/cards/second_virtual.png?inline';
import virtual1 from 'assets/cards/virtual_1.png?inline';
import virtual2 from 'assets/cards/virtual_2.png?inline';
import virtual3 from 'assets/cards/virtual_3.png?inline';
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
    /** @deprecated */
    [100008]: {
        design: secondVirtual,
    },
    /** @deprecated */
    [100005]: {
        design: seamlessVirtual
    },
    /** @deprecated */
    [100004]: {
        design: secondVirtual
    },
    /** @deprecated */
    [100010]: {
        // inverse: true,
        design: secondVirtual,
        // border: '2px solid #175AEA',
        // previewBorder: '1px solid #175AEA'
    },
    [111018]: {
        inverse: true,
        design: virtual1,
        border: '2px solid #B3BAC4',
        previewBorder: '1px solid #B3BAC4'
    },
    [111021]: {
        design: virtual2,
        colorLogo: true,
        border: '2px solid #B3BAC4',
        previewBorder: '1px solid #B3BAC4'
    },
    [111028]: {
        design: virtual3,
    },
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

    let colorLogo: any = 'colorLogo' in data ? data.colorLogo : undefined;
    if (!colorLogo) {
        colorLogo = false;
    }

    return (
        <div
            className={classNames(styles.card, inverse && styles.inverse, colorLogo && styles.colorLogo, className)}
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