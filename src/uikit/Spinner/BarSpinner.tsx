import classNames from 'classnames';
import styles from './BarSpinner.module.scss';

type BarSpinnerProps = {
    size: number,
    className?: string
}

export function BarSpinner({ size, className }: BarSpinnerProps) {
    const baseSize = 64;
    const scale = size / baseSize;
    const freeCircleDiameter = 30;
    const freeCircleRadius = freeCircleDiameter / 2;
    const scaledFreeCircleRadius = freeCircleRadius * scale;

    const baseBarHeight = 16;
    const baseBarWidth = 5;
    const barHeight = baseBarHeight * scale;
    const barWidth = baseBarWidth * scale;
    const barLeft = size / 2 - barWidth / 2;
    const barTop = size / 2 - barHeight;

    const containerRadius = size / 2;
    const barRadius = containerRadius - scaledFreeCircleRadius - 2;

    const angles = Array.from({ length: 8 }, (_, i) => i * 45);

    return (
        <div
            className={classNames(styles.spinnerWrapper, className)}
            style={{
                position: 'relative',
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            {angles.map((angle, i) => (
                <div
                    key={i}
                    className={styles.bar}
                    style={{
                        position: 'absolute',
                        top: barTop,
                        left: barLeft,
                        width: `${barWidth}px`,
                        height: `${barHeight}px`,
                        transformOrigin: 'center bottom',
                        transform: `rotate(${angle}deg) translate(0, -${barRadius}px)`,
                        animationDelay: `${((angles.length - i) * -0.11)}s`,
                    }}
                />
            ))}
        </div>
    );
}