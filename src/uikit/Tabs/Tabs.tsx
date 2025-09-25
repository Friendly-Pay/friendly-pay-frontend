import { Text } from '../Text';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './Tabs.module.scss';

export type TabItem = {
    id: string;
    label: string;
};

type TabsProps = {
    items: TabItem[];
    activeId: string;
    onChange: (id: string) => void;
    className?: string;
};

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className }) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const btnRefs = React.useRef<any>({});
    const rafRef = useRef<any>(null);
    const [indicator, setIndicator] = React.useState<{ width: number; x: number }>({ width: 0, x: 0 });

    const recalculate = () => {
        const el = btnRefs.current[activeId];
        const wrap = containerRef.current;
        if (!el || !wrap) return;
        const elRect = el.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const width = Math.round(elRect.width);
        const x = Math.round(elRect.left - wrapRect.left);
        rafRef.current = requestAnimationFrame(() => setIndicator({ width, x }));
    };

    useEffect(() => {
        recalculate();
    }, [activeId]);

    useEffect(() => {
        const observer = new ResizeObserver(recalculate);
        const wrap = containerRef.current;
        if (wrap) observer.observe(wrap);

        const buttons = Object.values(btnRefs.current);
        for (const button of buttons) {
            observer.observe(button as HTMLButtonElement);
        }
        const handleResize = () => {
            recalculate();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, [items]);

    return (
        <div
            ref={containerRef}
            role='tablist'
            className={classNames(styles.root, className)}
        >
            {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                    <button
                        ref={el => btnRefs.current[item.id] = el}
                        key={item.id}
                        id={item.id}
                        role="tab"
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        className={classNames(styles.button, isActive && styles.active)}
                        onClick={() => onChange(item.id)}
                    >
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                        >{item.label}</Text>
                    </button>
                );
            })}
            <div
                className={styles.indicator}
                style={{ width: `${indicator.width}px`, transform: `translateX(${indicator.x}px)` }}
                aria-hidden
            />
        </div>
    );
};