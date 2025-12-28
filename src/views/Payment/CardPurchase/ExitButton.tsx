import { usePaymentButtonsVisibility } from '../buttonsContext';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { usePaymentStore } from '@/states/payment/store';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * Использовать когда нет выбранной валюты, для покупки карты.
 */
export function ExitButton() {
    const [t] = useTranslation();

    const currencyModalOpened = usePaymentStore(state => state.currencyModal.opened);

    const navigate = useNavigate();
    const { buttonsVisible, showButtons } = usePaymentButtonsVisibility();

    useLayoutEffect(() => {
        if (!currencyModalOpened) {
            showButtons();
        }
    }, [currencyModalOpened]);

    const handleCancel = () => {
        const { resetCardPurchase } = usePaymentStore.getState();
        navigate(Routes.HOME);
        resetCardPurchase();
    };

    return (
        <TelegramButtons.SecondaryButton
            text={t('Cancel')}
            visible={buttonsVisible}
            onClick={handleCancel}
        />
    );
}