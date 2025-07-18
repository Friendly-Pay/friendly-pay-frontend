import { CityItem } from './CityItem';
import { SelectModal } from '@/components/Modals/SelectModal';
import { cities, CityOption } from '@/states/verification/config';
import { Input } from '@/uikit';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CitySelect.module.scss';

type CitySelectProps = {
    cityCode: string | null
    countryCode: string
    tabIndex?: number
    className?: string
    onSelect: (cityCode: string) => void
}

export function CitySelect({ cityCode, countryCode, tabIndex, className, onSelect }: CitySelectProps) {
    const { t } = useTranslation();
    const [opened, setOpened] = useState(false);

    const citiesList = useMemo(() => {
        return cities
            .filter((c) => c.country === countryCode)
            .map((c) => ({
                code: c.code,
                label: t(c.code),
            })) as CityOption[];
    }, [countryCode, t]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCities, setFilteredCities] = useState<CityOption[]>(citiesList);

    useEffect(() => {
        setSearchTerm('');
        setFilteredCities(citiesList);
    }, [citiesList]);

    const filterCities = (value: string) => {
        let m = citiesList;
        if (value.length > 0) {
            const query = value.toLowerCase().trim();
            m = citiesList.filter(
                (c) =>
                    c.code.toLowerCase().includes(query) ||
                    c.label.toLowerCase().includes(query)
            );
        }
        setFilteredCities(m);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        filterCities(value);
    };

    const handleCitySelect = (city: CityOption) => {
        setSearchTerm('');
        setFilteredCities(citiesList);
        onSelect(city.code);
        setOpened(false);
    };

    const handleOpen = () => setOpened(true);
    const handleClose = () => setOpened(false);

    const cityName = cityCode ? t(cityCode) : '';

    return (
        <div className={classNames(styles.root, className)}>
            <Input
                type="text"
                name="city"
                value={cityName}
                placeholder={t('City')}
                autoComplete="off"
                tabIndex={tabIndex}
                asSelect
                readOnly
                onClick={handleOpen}
            />

            <SelectModal
                isOpen={opened}
                title={t('Choose city')}
                search={searchTerm}
                onSearch={handleSearchChange}
                items={filteredCities}
                renderItem={(data) => (
                    <CityItem
                        key={data.code}
                        label={data.label}
                        onClick={() => handleCitySelect(data)}
                    />
                )}
                onClose={handleClose}
            />
        </div>
    );
}