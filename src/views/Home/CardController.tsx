import { CardDetailsModal } from '@/components/Modals/CardDetailsModal';
import { CurrencyModal as CurrencyModalUI } from '@/components/Modals/Currency/CurrencyModal';
import { TransactionDetailsModal } from '@/components/Modals/Transaction/TransactionDetailsModal';
import { Routes } from '@/routes';
import { isCardActivationInProgress } from '@/states/cards/helpers';
import { useCardsStore } from '@/states/cards/store';
import { CURRENCY } from '@/states/currency/currency';
import { CurrencyType } from '@/states/currency/hooks';
import { TOKENS } from '@/states/currency/tokens';
import { useGlobalStore } from '@/states/global';
import { usePaymentStore } from '@/states/payment/store';
import { isSumsubNotCompleted, useSumsubStore } from '@/states/sumsub/store';
import { useUserStore } from '@/states/user/store';
import { isRussianPhoneNumber } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { memo, PropsWithChildren, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function CardController({ children }: PropsWithChildren) {
    const selectedCardId = useCardsStore(state => state.selectedCardId);
    const selectedCardStatus = useCardsStore(state => state.myCards && selectedCardId ? state.myCards[selectedCardId].status : null);
    const loadMyCards = useCardsStore(state => state.loadMyCards);

    let refetchInterval = 30_000;
    if (selectedCardStatus && isCardActivationInProgress(selectedCardStatus)) {
        refetchInterval = 10_000;
    }

    useQuery({
        enabled: true,
        queryKey: ['state.cards'],
        queryFn: async () => {
            const { myCards, myCardsUpdatedAt } = useCardsStore.getState();
            if (myCardsUpdatedAt && Date.now() - myCardsUpdatedAt < refetchInterval) {
                return myCards;
            }
            return loadMyCards();
        },
        staleTime: 10_000,
        refetchOnMount: false,
        refetchInterval: refetchInterval,
        refetchOnWindowFocus: 'always',
        refetchIntervalInBackground: false
    });

    return (<>
        {children}

        <CurrencyModal />

        {selectedCardId && <>
            <CardDetailsModal />
            <TransactionDetailsModal />
        </>}
    </>);
}

const TOKENS_CURRENCY = Object.values(TOKENS);

const CurrencyModal = memo(function CurrencyModal() {
    const isOpen = usePaymentStore(state => state.currencyModal.opened);
    const modalState = usePaymentStore(state => state.currencyModal.modalState);
    const supportSbp = useGlobalStore(state => state.supportSbp);
    const userCountry = useUserStore(state => state.user?.country);

    const userPhoneNumber = useUserStore(state => state.user?.phoneNumber!);
    const closeCurrencyModal = usePaymentStore(state => state.closeCurrencyModal);

    let sbpAvailable = true;
    if (!supportSbp) {
        sbpAvailable = false;
    } else if (userCountry && userPhoneNumber) {
        sbpAvailable = userCountry === 'RUS' && isRussianPhoneNumber(userPhoneNumber);
    }

    const navigate = useNavigate();

    // @TODO вынести в класс BankCardActions (логика с картой будет в одном месте)
    const handleCurrencySelect = useCallback((currencyId: string, currencyType: CurrencyType) => {
        if (isSumsubNotCompleted() && currencyType === 'RUB') {
            closeCurrencyModal();
            navigate(Routes.SUMSUB_START);
            return;
        }

        const { setTopupCurrency, setCardPurchaseCurrency } = usePaymentStore.getState();

        closeCurrencyModal();

        if (currencyId === CURRENCY.RUB.id && isSumsubNotCompleted()) {
            useSumsubStore.getState().setSelectedCardTypeId(null);
            navigate(Routes.SUMSUB_START);
            return;
        }

        let redirectUrl: string | undefined;
        switch (modalState) {
            case 'TOPUP':
                setTopupCurrency(currencyId, currencyType);
                closeCurrencyModal();
                redirectUrl = Routes.TOPUP;
                break;
            case 'CARD_PURCHASE':
                setCardPurchaseCurrency(currencyId, currencyType);
                closeCurrencyModal();
                redirectUrl = Routes.CARD_PURCHASE;
                break;
        }

        if (redirectUrl && redirectUrl !== location.pathname) {
            navigate(redirectUrl);
        }
    }, [modalState, sbpAvailable, navigate, closeCurrencyModal]);

    return (
        <CurrencyModalUI
            isOpen={isOpen}
            sbp={CURRENCY.RUB}
            tokens={TOKENS_CURRENCY}
            spbAvailable={sbpAvailable}
            handleCurrencySelect={handleCurrencySelect}
            onClose={closeCurrencyModal}
        />
    );
});