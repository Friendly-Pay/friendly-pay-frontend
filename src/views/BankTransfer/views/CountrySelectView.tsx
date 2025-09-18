import { PageRoot } from '../components/PageRoot';
import { useBankTransferCurrenciesStore } from '../state/currencies';
import { useBankTransferStore } from '../state/store';
import { BankTransferMethod } from '../state/types';
import { MainLayout } from '@/components/common/MainLayout';
import { countries } from '@/states/verification/config';
import { Text } from '@/uikit';
import { SearchInput } from '@/uikit/Input/SearchInput';
import { CountryItem } from '@/views/Verification/components/Address/CountryItem';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './CountrySelectView.module.scss';

type CountryOption = {
    code: string;
    iso2: string;
    alpha3: string;
    emoji: string;
    label: string;
    searchKeys?: string[];
};

export function CountrySelectView() {
    const [t] = useTranslation();
    const selectedMethod = useBankTransferStore(state => state.selectedMethod);
    const bankTransferCountries = useBankTransferCurrenciesStore(state => state.bankTransferCountries);
    const globalBankTransferCountries = useBankTransferCurrenciesStore(state => state.globalBankTransferCountries);

    const sourceCodes = selectedMethod === BankTransferMethod.BankTransfer
        ? bankTransferCountries
        : globalBankTransferCountries;

    const countryOptions: CountryOption[] = useMemo(() => {
        return sourceCodes.map((code) => {
            const found = countries.find((c) => c.iso2 === code || c.alpha3 === code);
            return {
                code,
                iso2: found?.iso2 ?? code,
                alpha3: found?.alpha3 ?? code,
                emoji: found?.emoji ?? '🌐',
                label: t(found ? found.iso2 : code),
                searchKeys: found?.searchKeys,
            } as CountryOption;
        });
    }, [sourceCodes, t]);

    const [searchTerm, setSearchTerm] = useState('');
    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return countryOptions;
        return countryOptions
            .filter((opt) => {
                const labelMatch = opt.label.toLowerCase().includes(q);
                const codeMatch = opt.iso2.toLowerCase().includes(q) || opt.alpha3.toLowerCase().includes(q);
                const keysMatch = opt.searchKeys?.some((k) => k.toLowerCase().includes(q));
                return Boolean(labelMatch || codeMatch || keysMatch);
            })
            .sort((a, b) => {
                if (a.label.toLowerCase().startsWith(q) && !b.label.toLowerCase().startsWith(q)) return -1;
                return 1;
            });
    }, [countryOptions, searchTerm]);

    const navigate = useNavigate();
    const handleSelect = (option: CountryOption) => {
        useBankTransferStore.getState().setCountry(option.code);
        navigate('/bank-transfer/calculate');
    };

    let title: string;
    if (selectedMethod === BankTransferMethod.GlobalBankTransfer) {
        title = t('Where to send SWIFT');
    } else {
        title = t('Where to send transfer');
    }

    if (!selectedMethod) {
        return <Navigate
            to='/bank-transfer'
            replace
        />;
    }

    return (
        <MainLayout>
            <PageRoot>
                <div className={styles.content}>
                    <Text
                        type='headline'
                        align='left'
                        weight='semibold'
                        className={styles.title}
                    >
                        {title}
                    </Text>

                    <div className={styles.search}>
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                    </div>

                    <div>
                        {filtered.map((opt) => (
                            <CountryItem
                                key={opt.code}
                                emoji={opt.emoji}
                                label={opt.label}
                                onClick={() => handleSelect(opt)}
                            />
                        ))}
                    </div>
                </div>
            </PageRoot>
        </MainLayout>
    );
}

