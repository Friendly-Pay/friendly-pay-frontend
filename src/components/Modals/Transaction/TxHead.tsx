import { Text } from '@/uikit';
import { ModalContext } from '@/uikit/Modal/Context';
import { formatDateWithLabel } from '@/utils/date';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TxHead.module.scss';

type TxHeadProps = {
    createdAt: number
    className?: string
}

export function TxHead({ createdAt, className }: TxHeadProps) {
    const [t] = useTranslation();
    const context = useContext(ModalContext);
    const handleClose = () => {
        context.close?.();
    };

    const closeRef = useRef<HTMLDivElement>(null);
    const [sideWidth, setSideWidth] = useState(0);
    useLayoutEffect(() => {
        if (closeRef.current) {
            const { width } = closeRef.current.getBoundingClientRect();
            setSideWidth(width);
        }
    }, []);

    const cssVars = {
        '--side-width': `${sideWidth}px`
    } as React.CSSProperties;

    return (
        <div
            className={classNames(styles.head, className)}
            style={cssVars}
        >
            <div className={styles.content}>
                <div
                    ref={closeRef}
                    className={styles.close}
                    onClick={handleClose}
                >
                    {t('Close')}
                </div>
                <div className={styles.date}>
                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                    >  {formatDateWithLabel(new Date(Number(createdAt) * 1_000))}</Text>
                </div>
            </div>
        </div>
    );
}