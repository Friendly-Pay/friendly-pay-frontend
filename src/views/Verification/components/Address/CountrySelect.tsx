import { CountryItem } from './CountryItem';
import { SelectModal } from '@/components/Modals/SelectModal';
import { countries, Country, CountryOption } from '@/states/verification/config';
import { useSupportedCountriesStore } from '@/states/verification/country';
import { Input } from '@/uikit';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CountrySelect.module.scss';

type CountrySelectProps = {
    country: Country | null
    initialCountryCode: string | null,
    tabIndex?: number
    className?: string
    onSelect: (country: Country) => void
}

export function CountrySelect({ country, initialCountryCode, tabIndex, className, onSelect }: CountrySelectProps) {
    const [t, i18n] = useTranslation();
    const [opened, setOpened] = useState(false);
    const supportedCountries = useSupportedCountriesStore(state => state.codes);

    const countriesList = useMemo(() => {
        const list = countries.map((c) => ({
            ...c,
            label: t(c.iso2), // @TODO переводы подгружать только нужные
        }));
        return list.filter(c => supportedCountries.includes(c.alpha3) || supportedCountries.includes(c.iso2)) as CountryOption[];
    }, [t, i18n]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState<CountryOption[]>(countriesList);

    useEffect(() => {
        if (initialCountryCode) {
            let country: Country | undefined;
            const countryAvailable = supportedCountries.includes(initialCountryCode);
            if (countryAvailable) {
                country = countries.find(c => c.iso2 === initialCountryCode);
            }
            if (country) {
                onSelect(country);
            }
        }
    }, []);

    const filterCountries = (value: string) => {
        let m = countriesList;
        if (value.length > 0) {
            const query = value.toLowerCase().trim();
            m = countriesList
                .filter(v => {
                    const matchKeys = v.searchKeys?.some(k => k.toLowerCase().includes(query));
                    const matchAlpha3 = v.alpha3.toLowerCase().includes(query);
                    const matchLabel = v.label.toLowerCase().includes(query);
                    const matchPhone = `+${v.phoneCode}`.includes(query);
                    return Boolean(matchKeys || matchAlpha3 || matchLabel || matchPhone);
                })
                .sort((a, b) => {
                    if (`+${a.phoneCode}` === query && `+${b.phoneCode}` !== query) {
                        return -1;
                    }
                    if (
                        a.label.toLowerCase().startsWith(query) &&
                        !b.label.toLowerCase().startsWith(query)
                    ) {
                        return -1;
                    }
                    return 1;
                });
        }
        setFilteredCountries(m);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        filterCountries(value);
    };

    const handleCountrySelect = (country: Country) => {
        setSearchTerm('');
        setFilteredCountries(countriesList);
        onSelect(country);
        setOpened(false);
    };

    const handleOpen = () => {
        setOpened(true);
    };

    const handleClose = () => {
        setOpened(false);
    };

    let countryEmoji: any;
    if (country?.emoji) {
        countryEmoji = <div className={styles.emoji}>{country.emoji}</div>;
    }

    return (
        <div className={classNames(styles.root, className)}>
            <Input
                type='text'
                name='country'
                value={country ? t(country?.iso2) : ''}
                placeholder={t('Country')}
                autoComplete='off'
                tabIndex={tabIndex}
                startIcon={countryEmoji}
                asSelect
                readOnly
                onClick={handleOpen}
            />

            <SelectModal
                isOpen={opened}
                title={t('Choose country')}
                search={searchTerm}
                onSearch={handleSearchChange}
                items={filteredCountries}
                renderItem={(data) => <CountryItem
                    key={data.iso2}
                    emoji={data.emoji}
                    label={data.label}
                    onClick={() => handleCountrySelect(data)}
                />}
                onClose={handleClose}
            />
        </div>
    );
}