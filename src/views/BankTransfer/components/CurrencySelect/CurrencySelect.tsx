import { BankTransferCurrency } from '../../state/types';
import { CurrencyItem } from './CurrencyItem';
import { SelectedCurrency } from './SelectedCurrency';
import { SelectModal } from '@/components/Modals/SelectModal';
import { countries } from '@/states/verification/config';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CurrencySelect.module.scss';

type CurrencySelectProps = {
    selectedCurrency: BankTransferCurrency;
    availableCurrencies?: BankTransferCurrency[];
    className?: string;
    onSelect?: (currency: BankTransferCurrency) => void;
};

interface CurrencyOption {
    code: string;
    name: string;
    icon: string;
    asEmoji?: boolean;
}

const mapToCurrencyOption = (currency: BankTransferCurrency): CurrencyOption => ({
    code: currency.currency,
    name: currency.currency.toUpperCase(),
    icon: countries.find((c) => c.iso2 === currency.country || c.alpha3 === currency.country)?.emoji || '🌐',
    asEmoji: true,
});

export function CurrencySelect({ selectedCurrency, availableCurrencies, className, onSelect }: CurrencySelectProps) {
    const [t] = useTranslation();
    const [opened, setOpened] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedOption = useMemo(() => {
        if (!selectedCurrency) return null;
        return mapToCurrencyOption(selectedCurrency);
    }, [selectedCurrency]);

    const options = useMemo(() => {
        if (!availableCurrencies) return [];
        return availableCurrencies
            .map(mapToCurrencyOption)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [availableCurrencies]);

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q));
    }, [options, searchTerm]);

    const clickable = options.length > 1 && onSelect;

    const handleOpen = () => {
        if (!clickable) return;
        setOpened(true);
    };
    const handleClose = () => setOpened(false);
    const handleSearchChange = (v: string) => setSearchTerm(v);

    const handleSelect = (code: string) => {
        if (!availableCurrencies) return;
        const selectedCurrency = availableCurrencies.find(currency => currency.currency === code);
        if (selectedCurrency) {
            setSearchTerm('');
            onSelect?.(selectedCurrency);
            setOpened(false);
        }
    };

    return (
        <div className={classNames(styles.root, className)}>
            {selectedOption && <SelectedCurrency
                name={selectedOption.name}
                image={selectedOption.icon}
                asEmoji
                clickable={options.length > 1}
                onClick={handleOpen}
            />}

            <SelectModal
                isOpen={opened}
                title={t('Choose currency')}
                search={searchTerm}
                onSearch={handleSearchChange}
                items={filtered}
                renderItem={currency => (
                    <CurrencyItem
                        key={currency.code}
                        icon={currency.icon}
                        name={currency.name}
                        disabled={!clickable}
                        onClick={() => handleSelect(currency.code)}
                    />
                )}
                onClose={handleClose}
            />
        </div>
    );
}
