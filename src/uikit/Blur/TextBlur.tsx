import React, { memo, useEffect, useRef, useState } from 'react';

type TextBlurProps = {
    cell?: number;
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
};

export const TextBlur = memo(function TextBlur({
    cell = 8,
    rows = 3,
    className,
    style,
}: TextBlurProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [cols, setCols] = useState(0);

    useEffect(() => {
        if (!svgRef.current) return;
        const update = (w: number) => setCols(Math.max(1, Math.ceil(w / cell)));
        update(svgRef.current.getBoundingClientRect().width);
    }, [cell]);

    const palette = ['#0B1220', '#121A2B', '#1A2436', '#223047'];
    const pick = () => palette[Math.random() * palette.length | 0];

    const rects = () => {
        const out: React.ReactElement[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                out.push(
                    <rect
                        key={`${r}-${c}`}
                        x={c * cell}
                        y={r * cell}
                        width={cell}
                        height={cell}
                        fill={pick()}
                    />,
                );
            }
        }
        return out;
    };

    const height = rows * cell;
    const width = cols * cell || 1;

    return (
        <svg
            ref={svgRef}
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className={className}
            style={{
                display: 'block',
                ...style,
            }}
        >
            {rects()}
        </svg>
    );
});