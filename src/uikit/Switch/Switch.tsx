import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './Switch.module.scss';


export type SwitchProps = {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
    const {
        checked,
        onChange,
        disabled,
        className
    } = props;

    const isChecked = checked;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked);
    };

    return (
        <span
            className={classNames(
                styles.root,
                disabled && styles.disabled,
                isChecked && styles.checked,
                className,
            )}
        >
            <input
                ref={ref}
                type="checkbox"
                aria-checked={isChecked}
                className={styles.input}
                checked={isChecked}
                disabled={disabled}
                onChange={handleChange}
            />
            <span className={styles.thumb} />
        </span>
    );
});

Switch.displayName = 'Switch';