import { Text } from '@/uikit';
import { useLayoutEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import styles from './CalcInput.module.scss';

type CalcInputProps = {
    name: string
    label: string
    value: string | number
    onInput: (value: string) => void
    currencySelect: React.ReactNode
    className?: string
}

export function CalcInput({ name, label, value = '', onInput, currencySelect, className }: CalcInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const isComposingRef = useRef(false);
    const pendingCaretRef = useRef<number | null>(null);

    const normalize = (raw: string): string => {
        let s = raw.replace(/\s+/g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
        const firstDot = s.indexOf('.');
        if (firstDot !== -1) s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
        if (s.startsWith('.')) s = '0' + s;
        if (s.length > 1 && s[0] === '0' && s[1] !== '.') s = s.replace(/^0+/, '') || '0';
        return s;
    };

    const formatThousands = (n: string): string => {
        if (!n) return '';
        const hasDot = n.includes('.');
        const [intRaw, frac = ''] = n.split('.');
        const sign = intRaw.startsWith('-') ? '-' : '';
        const int = intRaw.replace('-', '');
        const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return sign + grouped + (hasDot ? '.' + frac : '');
    };

    const displayValue = useMemo(() => {
        const s = String(value ?? '');
        const normalized = s ? normalize(s) : '';
        return normalized ? formatThousands(normalized) : '';
    }, [value]);

    const setCaret = (pos: number) => {
        const el = inputRef.current;
        if (!el) return;
        requestAnimationFrame(() => {
            try { el.setSelectionRange(pos, pos); } catch { }
        });
    };

    const caretFromValidCount = (formatted: string, validLeftCount: number) => {
        let i = 0, count = 0;
        while (i < formatted.length && count < validLeftCount) {
            if (/[0-9.]/.test(formatted[i])) count += 1;
            i += 1;
        }
        return i;
    };

    const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
        const ev = e as unknown as InputEvent;
        if (ev.inputType !== 'insertText' || !ev.data) return;
        const el = inputRef.current;
        if (!el) return;
        const data = ev.data.replace(',', '.');
        if (data === '.') {
            const curr = displayValue || '';
            const { selectionStart, selectionEnd } = el;
            const selection = curr.slice(selectionStart ?? 0, selectionEnd ?? 0);
            if (curr.includes('.') && !selection.includes('.')) e.preventDefault();
        }
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isComposingRef.current) {
            // во время composition даём вводить как есть
            onInput(normalize(event.currentTarget.value));
            return;
        }

        const raw = event.currentTarget.value;
        const caret = event.currentTarget.selectionStart ?? raw.length;

        // считаем количество валидных символов слева от курсора (цифры и точка)
        const leftRaw = raw.slice(0, caret).replace(/\s+/g, '').replace(/,/g, '.');
        const validLeftCount = (leftRaw.match(/[0-9.]/g) || []).length;

        const normalizedNext = normalize(raw);
        const formattedNext = formatThousands(normalizedNext);

        onInput(normalizedNext);
        pendingCaretRef.current = caretFromValidCount(formattedNext, validLeftCount);
    };

    useLayoutEffect(() => {
        if (pendingCaretRef.current != null) {
            setCaret(pendingCaretRef.current);
            pendingCaretRef.current = null;
        }
    }, [displayValue]);

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false;
        const normalizedNext = normalize(e.currentTarget.value);
        const formattedNext = formatThousands(normalizedNext);
        if (normalizedNext !== String(value)) {
            onInput(normalizedNext);
            pendingCaretRef.current = formattedNext.length;
        }
    };

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.currency}>
                <Text
                    type='caption'
                    align='left'
                    className={styles.label}
                >
                    {label}
                </Text>
                {currencySelect}
            </div>

            <div className={styles.content}>
                <input
                    ref={inputRef}
                    name={name}
                    className={styles.input}
                    value={displayValue}
                    onChange={handleInput}
                    onInput={handleInput}
                    onBeforeInput={handleBeforeInput}
                    onCompositionStart={() => { isComposingRef.current = true; }}
                    onCompositionEnd={handleCompositionEnd}
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="0"
                />
            </div>
        </div>
    );
}