import { CurrencyType } from '../currency/hooks';
import { fetchSbpRates } from './fetch';

export class PaymentCurrencyRate {
    private static readonly loadingPromises = new Map<CurrencyType, Promise<number>>();

    static async loadRate(currencyType: CurrencyType): Promise<number> {
        // Если запрос уже выполняется, возвращаем существующий промис
        if (this.loadingPromises.has(currencyType)) {
            return this.loadingPromises.get(currencyType)!;
        }

        // Создаем новый запрос
        const loadingPromise = this.fetchRate(currencyType);
        this.loadingPromises.set(currencyType, loadingPromise);

        try {
            const rate = await loadingPromise;
            return rate;
        } finally {
            this.loadingPromises.delete(currencyType);
        }
    }

    private static async fetchRate(currencyType: CurrencyType): Promise<number> {
        switch (currencyType) {
            case 'RUB':
                const res = await fetchSbpRates();
                return res.rate;
            default:
                return 1;
        }
    }
}