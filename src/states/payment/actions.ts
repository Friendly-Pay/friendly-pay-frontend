import { useCardsStore } from '../cards/store';
import { usePaymentStore } from './store';
import i18next from 'i18next';
import { NavigateFunction } from 'react-router-dom';

export class PaymentActions {
    static topupCard(cardId: number, navigate: NavigateFunction) {
        useCardsStore.getState().openCurrencyModal({
            title: i18next.t('Choose currency'),
            onSelectCurrency: (currencyId) => {
                usePaymentStore.getState().startTopup(cardId, currencyId);
                navigate('/payments/topup');
            }
        });
    }

    static purchaseCard(cardTypeId: number, navigate: NavigateFunction) {
        useCardsStore.getState().openCurrencyModal({
            title: i18next.t('How to pay'),
            onSelectCurrency: (currencyId) => {
                usePaymentStore.getState().startCardPurchase(cardTypeId, currencyId);
                navigate('/payments/pay-new-card');
            }
        });
    }
}