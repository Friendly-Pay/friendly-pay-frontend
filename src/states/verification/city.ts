import { fetchSupportedCities } from './fetch';
import { FetchStatus } from '@/utils/api';
import { create } from 'zustand';

interface SupportedDictState {
    cities: { [country: string]: string[] } | null
    status: FetchStatus
    load: () => Promise<void>
    clear: () => void
}

export const useSupportedCitiesStore = create<SupportedDictState>()(
    (set) => ({
        cities: null,
        status: FetchStatus.Idle,
        load: async () => {
            set({ status: FetchStatus.Pending });
            try {
                const list = await fetchSupportedCities();
                const citiesMap: Record<string, string[]> = {};
                for (const city of list) {
                    if (!citiesMap[city.country]) {
                        citiesMap[city.country] = [];
                    }
                    citiesMap[city.country].push(city.code);
                }
                set({ cities: citiesMap, status: FetchStatus.Fulfilled });
            } catch (error) {
                console.error(error);
                set({ cities: null, status: FetchStatus.Rejected });
            }
        },
        clear: () => set({ cities: null, status: FetchStatus.Idle }),
    })
);