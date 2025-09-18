import { SelectModal } from '@/components/Modals/SelectModal';
import { Input, Text } from '@/uikit';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './SelectInput.module.scss';

type SelectInputProps = {
    value: string | null; // selected key from field.selectValues
    selectValues: { key: string, value: string }[], // field.selectValues
    fieldTitle: string;
    description?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
    onSelect: (key: string) => void;
};

export function SelectInput({ value, selectValues, fieldTitle, className, description, error, disabled, onSelect }: SelectInputProps) {
    const [t] = useTranslation();
    const [opened, setOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const options = useMemo(() => selectValues.map(item => ({ ...item, value: t(item.value) })) || [], [selectValues]);

    const selectedLabel = useMemo(() => {
        const found = options.find(o => o.key === value);
        return found?.value ? t(found.value) : '';
    }, [options, value, t]);

    const [filtered, setFiltered] = useState(options);

    useEffect(() => {
        setFiltered(options);
        setSearchTerm('');
    }, [options]);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
        const q = query.trim().toLowerCase();
        if (!q) {
            setFiltered(options);
            return;
        }
        setFiltered(
            options.filter(o =>
                o.value.toLowerCase().includes(q) || o.key.toLowerCase().includes(q)
            )
        );
    };

    const handleSelect = (key: string) => {
        onSelect(key);
        setOpened(false);
        setSearchTerm('');
    };

    const handleOpen = () => {
        if (disabled) return;
        setOpened(true);
    };
    const handleClose = () => setOpened(false);

    return (
        <div className={classNames(styles.root, className)}>
            <Input
                type="text"
                value={selectedLabel}
                placeholder={fieldTitle}
                autoComplete="off"
                asSelect
                readOnly
                disabled={disabled}
                onClick={handleOpen}
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

            <SelectModal
                isOpen={opened}
                title={fieldTitle}
                search={searchTerm}
                onSearch={handleSearch}
                items={filtered}
                renderItem={(opt) => (
                    <div
                        key={opt.key}
                        className={styles.item}
                        onClick={() => handleSelect(opt.key)}
                    >
                        <Text
                            type="body"
                            align="left"
                        >{opt.value}</Text>
                    </div>
                )}
                onClose={handleClose}
            />
        </div>
    );
}

