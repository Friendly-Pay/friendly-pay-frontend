import { useDeviceStore } from '@/states/device/state';
import { easeInOut } from 'framer-motion';
import { PropsWithChildren, useEffect, useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './OffersSlider.module.scss';

type OffersSliderProps = {
    className?: string
}

export function OffersSlider({ className, children }: PropsWithChildren<OffersSliderProps>) {
    const platform = useDeviceStore(state => state.platform);
    const isDesktop = !(platform === 'ios' || platform === 'android');

    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const dragging = useRef(false);
    const step = useRef(0);
    const startX = useRef(0);
    const lastClientX = useRef(0);

    const snapByGesture = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const delta = lastClientX.current - startX.current;
        const threshold = 12;
        const slideCount = container.children.length;

        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentIndex = Math.round(container.scrollLeft / step.current);

        let targetIndex = currentIndex;
        if (Math.abs(delta) > threshold) {
            targetIndex += delta > 0 ? -1 : 1;
        }

        targetIndex = Math.max(0, Math.min(targetIndex, slideCount - 1));

        const targetPosition = targetIndex === slideCount - 1
            ? Math.max(0, maxScroll)
            : targetIndex * step.current;

        animateScroll(container.scrollLeft, targetPosition);
    };

    const animateScroll = (start: number, target: number) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const distance = target - start;
        const duration = 300;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            container.scrollLeft = start + distance * easeInOut(progress);

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = null;
            }
        };

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        dragging.current = true;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        startX.current = clientX;
        lastClientX.current = clientX;

        document.addEventListener('mousemove', handlePointerMove);
        document.addEventListener('touchmove', handlePointerMove, { passive: false });
        document.addEventListener('mouseup', handlePointerEnd);
        document.addEventListener('touchend', handlePointerEnd);
        document.addEventListener('touchcancel', handlePointerEnd);
    };

    const handlePointerMove = (e: any) => {
        if (!dragging.current || !containerRef.current) return;
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        lastClientX.current = clientX;
    };

    const handlePointerEnd = () => {
        dragging.current = false;
        snapByGesture();

        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('touchmove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerEnd);
        document.removeEventListener('touchend', handlePointerEnd);
        document.removeEventListener('touchcancel', handlePointerEnd);
    };

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (container) {
            const firstSlide = container.children[0] as HTMLElement;
            const slideWidth = firstSlide.offsetWidth;
            const gap = parseInt(getComputedStyle(container).gap) || 0;
            step.current = slideWidth + gap;
        }
    }, []);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handlePointerMove);
            document.removeEventListener('touchmove', handlePointerMove);
            document.removeEventListener('mouseup', handlePointerEnd);
            document.removeEventListener('touchend', handlePointerEnd);
            document.removeEventListener('touchcancel', handlePointerEnd);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    return (
        <div className={classNames(styles.scrollableListWrap, className)}>
            <div
                ref={containerRef}
                className={styles.scrollableList}
                onMouseDown={isDesktop ? handlePointerDown : undefined}
                onTouchStart={isDesktop ? handlePointerDown : undefined}
            >
                {children}
            </div>
        </div>
    );
}