import { countries } from './config';
import { fetchSupportedCountries, fetchUserCountry } from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SupportedDictState {
    codes: string[]
    status: FetchStatus
    load: () => Promise<void>
    clear: () => void
}

export const useSupportedCountriesStore = create<SupportedDictState>()(
    persist(
        (set) => ({
            codes: [],
            status: FetchStatus.Idle,
            load: async () => {
                set({ status: FetchStatus.Pending });
                try {
                    const codes = await fetchSupportedCountries();
                    set({ codes, status: FetchStatus.Fulfilled });
                } catch (error) {
                    console.error(error);
                    set({ codes: [], status: FetchStatus.Rejected });
                }
            },
            clear: () => set({ codes: [], status: FetchStatus.Idle }),
        }),
        {
            name: 'countries-supported-iso2',
            version: 1,
        }
    )
);

interface CountryCodeState {
    code: string | null
    status: FetchStatus
    load: () => Promise<void>
}

export const useUserInitialCountryStore = create<CountryCodeState>()(
    (set) => ({
        code: null,
        status: FetchStatus.Idle,
        load: async () => {
            set({ status: FetchStatus.Pending });
            try {
                const code = await fetchUserCountry();
                set({ code, status: FetchStatus.Fulfilled });
            } catch {
                set({ status: FetchStatus.Rejected });
            }
        },
    })
);

const ISO2_REGEX = /^[A-Z]{2}$/i;

export const getCountryByIso2 = (code: string) => {
    const iso2 = code.trim().toUpperCase();
    if (!ISO2_REGEX.test(iso2)) {
        console.warn(`[getCountryByIso2] invalid ISO2 code: "${code}"`);
        return undefined;
    }
    return countries.find(c => c.iso2 === iso2);
};

export const getCountryByAlpha3 = (code: string) => {
    const alpha3 = code.trim().toUpperCase();
    return countries.find(c => c.alpha3 === alpha3);
};