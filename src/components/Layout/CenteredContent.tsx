import { useDeviceStore } from '@/states/device/state';
import { PropsWithChildren, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './CenteredContent.module.scss';

type CenteredContentProps = {
    className?: string
}

export function CenteredContent({ children, className }: PropsWithChildren<CenteredContentProps>) {
    const centeredRef = useRef<HTMLDivElement>(null);
    const platform = useDeviceStore(state => state.platform);
    const contentSafeAreaInset = useDeviceStore(state => state.contentSafeAreaInset);

    useLayoutEffect(() => {
        if (!centeredRef.current) {
            return;
        }

        let screenHeight = 0;
        if (platform === 'ios' || platform === 'android') {
            screenHeight = window.Telegram.WebApp.viewportHeight;
        } else {
            screenHeight = window.Telegram.WebApp.viewportStableHeight || window.innerHeight;
        }

        const marginTop = Math.ceil(screenHeight * 0.25);
        const safeMarginTop = Math.max(marginTop - contentSafeAreaInset.top, 0);
        centeredRef.current.style.marginTop = `${safeMarginTop}px`;
    }, []);

    return (
        <div
            ref={centeredRef}
            className={classNames(styles.centered, className)}
        >
            {children}
        </div>
    );
}