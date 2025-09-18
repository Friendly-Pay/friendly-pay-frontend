import { Text } from '@/uikit';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './FileInput.module.scss';

type FileInputProps = {
    value: File | null;
    onChange: (file: File | null) => void;
    name: string;
    label: string;
    description?: string;
    className?: string;
    accept?: string;
    error?: string;
    capture?: 'user' | 'environment' | string;
    disableDrop?: boolean;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const DEFAULT_ACCEPT = 'image/*';

const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let v = bytes;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

const fileExt = (name: string) => {
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
};

const fadeAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1 }
};

export function FileInput({
    name,
    value,
    onChange,
    description,
    className,
    label,
    error: errorProp,
    accept = DEFAULT_ACCEPT,
    capture,
    disableDrop
}: FileInputProps) {
    const [t] = useTranslation();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const validate = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE) {
            return t('The file is too large. Maximum is {{size}}.', {
                size: formatBytes(MAX_FILE_SIZE)
            });
        }
        if (accept.includes('image') && !file.type.startsWith('image/')) {
            return t('Only image files are allowed.');
        }
        const ext = fileExt(file.name);
        const imageExtensions = ['jpg', 'jpeg', 'png'];
        if (accept.includes('image') && !imageExtensions.includes(ext)) {
            return t('Unsupported image format. Use JPG or PNG.');
        }
        return null;
    };

    const resetNativeInput = () => {
        if (inputRef.current) inputRef.current.value = '';
    };

    const handlePickClick = () => {
        setError(null);
        resetNativeInput();
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] || null;
        if (!file) {
            onChange(null);
            return;
        }

        const validationError = validate(file);
        if (validationError) {
            setError(validationError);
            onChange(null);
            return;
        }

        setError(null);
        onChange(file);
    };

    const prevent = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (disableDrop) return;
        prevent(e);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const validationError = validate(file);
        if (validationError) {
            setError(validationError);
            onChange(null);
            return;
        }

        setError(null);
        onChange(file);
    };

    let title: string;
    let text: string;
    if (value?.name && value?.size) {
        title = value.name;
        text = formatBytes(value.size);
    } else {
        title = label;
        text = 'Загрузите фото';
    }

    return (
        <div className={classNames(styles.root, value && styles.hasFile, className)}>
            <div
                className={styles.button}
                onDragOver={disableDrop ? undefined : prevent}
                onDragEnter={disableDrop ? undefined : prevent}
                onDrop={handleDrop}
                onClick={handlePickClick}
            >
                <input
                    ref={inputRef}
                    className={styles.nativeInput}
                    name={name}
                    type="file"
                    accept={accept}
                    capture={capture as any}
                    multiple={false}
                    onChange={handleChange}
                    tabIndex={-1}
                    aria-hidden
                />

                <AnimatePresence
                    initial={false}
                    mode='popLayout'
                >
                    <motion.div
                        key={value ? 'has-file' : 'empty'}
                        {...fadeAnim}
                    >
                        <Text
                            type='body'
                            align='center'
                            weight='medium'
                            className={styles.title}
                        >
                            {title}
                        </Text>
                        <Text
                            type='caption'
                            align='center'
                            weight='regular'
                            className={styles.text}
                        >
                            {text}
                        </Text>
                    </motion.div>
                </AnimatePresence>
            </div>

            {Boolean(error || errorProp || description) && (
                <Text
                    type="captionSmall"
                    align="left"
                    className={classNames(styles.caption, error && styles.error)}
                >
                    {error || errorProp || description}
                </Text>
            )}
        </div>
    );
}