import { useUserStore } from '@/states/user/store';
import { Input, Text } from '@/uikit';
import { getDateFormatData } from '@/utils/date';
import { maskitoDateOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './DateInput.module.scss';

interface DateInputProps {
    value: string; // ISO string (YYYY-MM-DD)
    onInput: (value: string) => void;
    description?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
}

export function DateInput({
    value,
    onInput,
    description,
    placeholder,
    className,
    error,
    disabled,
}: DateInputProps) {
    const languageCode = useUserStore(state => state.languageCode);
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { separator: dateSeparator, format: dateFormat } = useMemo(
        () => getDateFormatData(languageCode),
        [languageCode]
    );

    const maskitoOptions = useMemo(
        () =>
            maskitoDateOptionsGenerator({
                mode: dateFormat as any,
                separator: dateSeparator,
            }),
        [dateFormat, dateSeparator]
    );

    const maskRef = useMaskito({ options: maskitoOptions });

    const formatDateToLocal = useCallback(
        (isoDate: string): string => {
            if (!isoDate) return '';
            // ожидаем YYYY-MM-DD
            const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
            if (!m) return '';
            const y = +m[1], mm = +m[2], dd = +m[3];

            // базовая проверка валидности
            const dt = new Date(y, mm - 1, dd);
            if (dt.getFullYear() !== y || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return '';

            const day = String(dd).padStart(2, '0');
            const month = String(mm).padStart(2, '0');
            const year = String(y);

            switch (dateFormat) {
                case 'dd/mm/yyyy': return `${day}${dateSeparator}${month}${dateSeparator}${year}`;
                case 'mm/dd/yyyy': return `${month}${dateSeparator}${day}${dateSeparator}${year}`;
                case 'yyyy/mm/dd': return `${year}${dateSeparator}${month}${dateSeparator}${day}`;
                default: return `${day}${dateSeparator}${month}${dateSeparator}${year}`;
            }
        },
        [dateFormat, dateSeparator]
    );

    const parseLocalToISO = useCallback(
        (localDate: string): string => {
            if (localDate.length !== dateFormat.length) return '';
            const parts = localDate.split(dateSeparator);
            let d: number, m: number, y: number;

            switch (dateFormat) {
                case 'dd/mm/yyyy': [d, m, y] = parts.map(Number); break;
                case 'mm/dd/yyyy': [m, d, y] = parts.map(Number); break;
                case 'yyyy/mm/dd': [y, m, d] = parts.map(Number); break;
                default: [d, m, y] = parts.map(Number);
            }

            // валидация реальной даты
            const dt = new Date(y, m - 1, d);
            if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return '';

            // каноническая строка
            const mm = String(m).padStart(2, '0');
            const dd = String(d).padStart(2, '0');
            return `${String(y).padStart(4, '0')}-${mm}-${dd}`;
        },
        [dateFormat, dateSeparator]
    );

    useEffect(() => {
        setDisplayValue(formatDateToLocal(value));
    }, [value, formatDateToLocal]);

    const handleInput = (newValue: string) => {
        setDisplayValue(newValue);

        // Если дата полностью введена, преобразуем в ISO и отправляем
        if (newValue.length === dateFormat.length) {
            const isoDate = parseLocalToISO(newValue);
            if (isoDate) {
                onInput(isoDate);
            }
        } else {
            // Если дата не полностью введена, отправляем пустую строку
            onInput('');
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setDisplayValue(formatDateToLocal(value));
    };

    return (
        <div className={classNames(styles.root, className)}>
            <Input
                ref={(el) => {
                    maskRef(el);
                    inputRef.current = el;
                }}
                type="text"
                value={displayValue}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={isFocused ? dateFormat.toUpperCase() : placeholder}
                inputMode="numeric"
                autoComplete="off"
                disabled={disabled}
            />

            {Boolean(error || description) && (
                <Text
                    type="captionSmall"
                    align="left"
                    className={classNames(styles.caption, error && styles.error)}
                >
                    {error || description}
                </Text>
            )}
        </div>
    );
}