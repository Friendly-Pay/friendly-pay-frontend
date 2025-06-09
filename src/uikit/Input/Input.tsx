import { Copy } from './Copy';
import { copyToClipboard } from '@/utils';
import { FormEvent, FormEventHandler, forwardRef, InputHTMLAttributes } from 'react';
import { toast } from 'sonner';
import classNames from 'classnames';
import styles from './Input.module.scss';

export type InputProps = {
    danger?: boolean
    canCopy?: boolean
    readOnly?: boolean
    copiedToastText?: string
    onInput?: (value: string, event: FormEvent<HTMLInputElement>) => void
    onCopied?: () => void
};

export const Input = forwardRef<
    HTMLInputElement,
    InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onInput'>
>(
    (
        { value, className, danger, readOnly, canCopy, copiedToastText, onInput, onCopied, ...props },
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
                    readOnly && styles.readonly,
                    canCopy && styles.canCopy,
                    danger && styles.danger,
                    className
                )}
            >
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
                        {<Copy />}
                    </div>
                    <div
                        className={styles.clickableArea}
                        onClick={handleCopyValue}
                    ></div>
                </>}
            </div>
        );
    }
);

Input.displayName = 'Input';