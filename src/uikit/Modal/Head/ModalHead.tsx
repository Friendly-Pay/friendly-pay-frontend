import { ModalContext } from '@/uikit/Modal/Context';
import { Text } from '@/uikit/Text';
import { PropsWithChildren, useContext, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ModalHead.module.scss';

type ModalHeadProps = {
    className?: string
}

export function ModalHead({ children, className }: PropsWithChildren<ModalHeadProps>) {
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
                <div className={styles.title}>
                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                    >
                        {children}
                    </Text>
                </div>
            </div>
        </div>
    );
}