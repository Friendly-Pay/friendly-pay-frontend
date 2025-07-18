import { InputHTMLAttributes, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './HiddenKeyboardInput.module.scss';

interface HiddenKeyboardInputProps {
    enabled: boolean;
    autoFocus?: boolean;
    inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
}

const getInputModePattern = (inputMode: 'text' | 'search' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'none' | undefined) => {
    switch (inputMode) {
        case 'numeric':
        case 'decimal':
        case 'tel':
            return '[0-9]*';
        default:
            return undefined;
    }
};

const _ = () => { };

export function HiddenKeyboardInput({ enabled, autoFocus = false, inputMode = 'text' }: HiddenKeyboardInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!autoFocus) return;
        focusInput();
    }, [autoFocus]);

    if (!enabled) return null;
    return createPortal(
        <input
            ref={inputRef}
            autoFocus={autoFocus}
            type={inputMode}
            inputMode={inputMode}
            autoComplete="off"
            pattern={getInputModePattern(inputMode)}
            className={styles.hidden}
            value=""
            onChange={_}

        />,
        document.body
    );
}