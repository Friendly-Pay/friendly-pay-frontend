import { Input, InputProps } from './Input';
import { forwardRef, InputHTMLAttributes, MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './AmountInput.module.scss';

type AmountInputProps = InputProps & {
    suffix: string;
    showSuffixWhenEmpty?: boolean;
    wrapperClassName?: string;
    suffixClassName?: string;
    className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onInput'>

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
    (
        {
            value,
            suffix,
            showSuffixWhenEmpty = false,
            wrapperClassName,
            suffixClassName,
            className,
            ...props
        },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const measureRef = useRef<HTMLSpanElement | null>(null);
        const [suffixLeft, setSuffixLeft] = useState(0);
        const measuredValue = value == null ? '' : String(value);

        const setRefs = useCallback((node: HTMLInputElement | null) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                (ref as MutableRefObject<HTMLInputElement | null>).current = node;
            }
        }, [ref]);

        const copyTextStylesToMeasure = useCallback(() => {
            const input = inputRef.current;
            const measure = measureRef.current;
            if (!input || !measure) return;
            const cs = getComputedStyle(input);
            measure.style.fontFamily = cs.fontFamily;
            measure.style.fontSize = cs.fontSize;
            measure.style.fontWeight = cs.fontWeight;
            measure.style.fontStyle = cs.fontStyle;
            measure.style.letterSpacing = cs.letterSpacing;
            measure.style.textTransform = cs.textTransform as string;
            measure.style.lineHeight = cs.lineHeight;
        }, []);

        const updateSuffixPosition = useCallback(() => {
            const input = inputRef.current;
            const measure = measureRef.current;
            if (!input || !measure) return;
            measure.textContent = measuredValue;
            const { paddingLeft } = getComputedStyle(input);
            const left = parseFloat(paddingLeft || '0');
            setSuffixLeft(left + measure.offsetWidth);
        }, [measuredValue]);

        useLayoutEffect(() => {
            copyTextStylesToMeasure();
        }, [copyTextStylesToMeasure, className]);

        useLayoutEffect(() => {
            updateSuffixPosition();
        }, [updateSuffixPosition]);

        useEffect(() => {
            window.addEventListener('resize', updateSuffixPosition);
            return () => {
                window.removeEventListener('resize', updateSuffixPosition);
            };
        }, [updateSuffixPosition]);

        const shouldRenderSuffix = showSuffixWhenEmpty || !!measuredValue;

        return (
            <div className={classNames(styles.root, wrapperClassName)}>
                <Input
                    ref={setRefs}
                    value={value}
                    className={classNames(styles.input, className)}
                    {...props}
                />
                <span
                    ref={measureRef}
                    className={styles.measure}
                    aria-hidden
                >
                    {measuredValue}
                </span>
                {shouldRenderSuffix && (
                    <span
                        className={classNames(styles.suffix, suffixClassName)}
                        style={{ left: `${suffixLeft}px` }}
                    >
                        {suffix}
                    </span>
                )}
            </div>
        );
    }
);

AmountInput.displayName = 'AmountInput';
