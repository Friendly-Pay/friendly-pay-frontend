import { TopupModal } from '../../components/Modals/TopupModal';
import { CardDetailsModal } from '@/components/Modals/CardDetailsModal';
// import { TransactionDetailsModal } from '@/components/Modals/TransactionDetailsModal';
import { useCardsStore } from '@/states/cards/store';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function CardController({ children }: PropsWithChildren) {
    const selectedCardId = useCardsStore(state => state.selectedCardId);
    const loadMyCards = useCardsStore(state => state.loadMyCards);
    const location = useLocation();

    const refetchInterval = 15_000;
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
        staleTime: 10_000,
        refetchOnMount: false,
        refetchInterval: refetchInterval,
        refetchOnWindowFocus: 'always',
        refetchIntervalInBackground: false
    });

    useEffect(() => {
        const { topupModal, detailsModal, closeTopupModal, closeCardDetails } = useCardsStore.getState();
        if (topupModal.opened) closeTopupModal();
        if (detailsModal.opened) closeCardDetails();
    }, [location]);

    return (<>
        {children}

        {selectedCardId && <>
            <TopupModal />
            <CardDetailsModal />
            {/* <TransactionDetailsModal /> */}
        </>}
    </>);
}