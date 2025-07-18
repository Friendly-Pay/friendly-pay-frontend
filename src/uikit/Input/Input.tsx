import { Copy } from './Copy';
import { ArrowDown } from '@/components/Icons/Arrow';
import { copyToClipboard } from '@/utils';
import { FormEvent, FormEventHandler, forwardRef, InputHTMLAttributes } from 'react';
import { toast } from 'sonner';
import classNames from 'classnames';
import styles from './Input.module.scss';

export type InputProps = {
    danger?: boolean
    canCopy?: boolean
    readOnly?: boolean
    asSelect?: boolean
    startIcon?: React.ReactNode;
    copiedToastText?: string
    onInput?: (value: string, event: FormEvent<HTMLInputElement>) => void
    onClick?: () => void
    onCopied?: () => void
};

export const Input = forwardRef<
    HTMLInputElement,
    InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onInput'>
>(
    (
        { value, className, danger, readOnly, asSelect, startIcon, canCopy, copiedToastText, onInput, onClick, onCopied, ...props },
        ref
    ) => {
        const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
            if (readOnly) return;
            onInput?.(event.currentTarget.value, event);
        };

        const handleCopyValue = async () => {
            if (!canCopy || !value) return;
            const sanitized = String(value).replace(/\s+/g, '');
            await copyToClipboard(sanitized);
            onCopied?.();
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            copiedToastText && toast.success(copiedToastText);
        };

        return (
            <div
                className={classNames(
                    styles.root,
                    !!value && styles.hasValue,
                    !!startIcon && styles.hasStartIcon,
                    readOnly && styles.readonly,
                    asSelect && styles.asSelect,
                    canCopy && styles.canCopy,
                    danger && styles.danger,
                    className
                )}
                onClick={onClick}
            >
                {startIcon && <div className={styles.startIcon}>
                    {startIcon}
                </div>}
                <span>
                    <input
                        ref={ref}
                        value={value}
                        className={styles.input}
                        onInput={handleInput}
                        readOnly={readOnly}
                        {...props}
                    />
                </span>

                {canCopy && <>
                    <div className={styles.addonIcon}>
                        <Copy />
                    </div>
                    <div
                        className={styles.clickableArea}
                        onClick={handleCopyValue}
                    ></div>
                </>}

                {asSelect && <div className={styles.addonIcon}>
                    <ArrowDown />
                </div>}
            </div>
        );
    }
);

Input.displayName = 'Input';