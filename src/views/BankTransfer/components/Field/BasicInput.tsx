import { Input, Text } from '@/uikit';
import classNames from 'classnames';
import styles from './BasicInput.module.scss';

type BasicInputProps = {
    name?: string
    value: string;
    pattern?: string
    onInput: (value: string) => void;
    minLength?: number;
    maxLength?: number;
    description?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
}

export function BasicInput({
    name,
    value,
    pattern,
    onInput,
    description,
    placeholder,
    minLength,
    maxLength,
    className,
    error,
    disabled,
}: BasicInputProps) {
    return (
        <div className={classNames(styles.root, className)}>
            <Input
                name={name}
                value={value}
                onInput={onInput}
                pattern={pattern}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                disabled={disabled}
                autoComplete='off'
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