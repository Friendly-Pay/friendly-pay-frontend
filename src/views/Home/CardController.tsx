import { CurrencyModal } from '../../components/Modals/CurrencyModal';
import { CardDetailsModal } from '@/components/Modals/CardDetailsModal';
import { TransactionDetailsModal } from '@/components/Modals/Transaction/TransactionDetailsModal';
import { useCardsStore } from '@/states/cards/store';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function CardController({ children }: PropsWithChildren) {
    const selectedCardId = useCardsStore(state => state.selectedCardId);
    const loadMyCards = useCardsStore(state => state.loadMyCards);
    const location = useLocation();

    const refetchInterval = 30_000;
    useQuery({
        enabled: location.pathname === '/' || location.pathname.startsWith('/payments'),
        queryKey: ['state.cards'],
        queryFn: async () => {
            const { myCards, myCardsUpdatedAt } = useCardsStore.getState();
            if (myCardsUpdatedAt && Date.now() - myCardsUpdatedAt < refetchInterval) {
                return myCards;
            }
            return loadMyCards();
        },
        staleTime: 60_000,
        refetchOnMount: false,
        refetchInterval: 30_000,
        refetchOnWindowFocus: 'always',
        refetchIntervalInBackground: false
    });

    useEffect(() => {
        const { currencyModal, detailsModal, transactionDetailsModal, closeCurrencyModal, closeCardDetails, closeTransactionDetails } = useCardsStore.getState();
        if (detailsModal.opened) closeCardDetails();
        if (currencyModal.opened) closeCurrencyModal();
        if (transactionDetailsModal.opened) closeTransactionDetails();
    }, [location]);

    return (<>
        {children}

        <CurrencyModal />

        {selectedCardId && <>
            <CardDetailsModal />
            <TransactionDetailsModal />
        </>}
    </>);
}