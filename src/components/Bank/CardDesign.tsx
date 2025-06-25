import eliteVirtual from 'assets/cards/elite_virtual.png?inline';
// import seamlessVirtual from 'assets/cards/seamless_virtual.png?inline';
import gamingVirtual from 'assets/cards/gaming_virtual.png';
import platinumVirtual from 'assets/cards/platinum_virtual.png?inline';
import premiumVirtual from 'assets/cards/premium_virtual.png?inline';
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
        design: eliteVirtual,
    },
    [100005]: {
        design: gamingVirtual
    },
    [100004]: {
        design: platinumVirtual
    },
    [100010]: {
        inverse: true,
        design: premiumVirtual,
        border: '2px solid #574199',
        previewBorder: '1px solid #574199'
    }
} as const;

export function CardDesign({ typeId, preview, style, className, backgroundClassName, children }: PropsWithChildren<CardDesignProps>) {
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
        >
            <div
                className={backgroundClassName}
                style={{ backgroundImage: `url(${data.design})`, border }}
            ></div>

            {children}
        </div>
    );
}