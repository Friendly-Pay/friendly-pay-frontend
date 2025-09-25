import { CardSelectModal } from '@/components/Modals/CardSelect/CardSelectModal';
import { TopupCard } from '@/components/Payment/Head/TopupCard';
import { CardStatus, useBankCard, useCardsStore } from '@/states/cards/store';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { useEffect, useMemo, useState } from 'react';

type TransferCardProps = {
    selectedCardId: number
}

export function TransferCard({ selectedCardId }: TransferCardProps) {
    const cards = useCardsStore(state => state.myCards);
    const bankCard = useBankCard(selectedCardId);
    const [selectOpened, setSelectOpened] = useState(false);
    const transferCardSelectOpened = useFriendsBonusesStore(state => state.transferCardSelectOpened);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => setSelectOpened(transferCardSelectOpened));
        return () => cancelAnimationFrame(frameId);
    }, [transferCardSelectOpened]);

    const availableCards = useMemo(() => {
        if (!cards) return [];
        const list = Object.values(cards);
        return list.filter(card => card.status === CardStatus.Active);
    }, [cards]);

    const handleSelectOpen = () => useFriendsBonusesStore.getState().openTransferCardSelect();
    const handleSelectClose = () => useFriendsBonusesStore.getState().closeTransferCardSelect();

    const handleCardSelect = (cardId: number) => {
        useFriendsBonusesStore.getState().setTransferCardId(cardId);
        handleSelectClose();
    };

    if (!bankCard) {
        return null;
    }

    return (
        <>
            <TopupCard
                typeId={bankCard.typeId}
                virtual={bankCard.isVirtual}
                balance={bankCard.balance}
                currency={bankCard.currency}
                lastFourDigits={bankCard.number!}
                paymentSystem={bankCard.paymentSystem}
                canSelect
                onClick={handleSelectOpen}
            />

            <CardSelectModal
                isOpen={selectOpened}
                cards={availableCards}
                onClose={handleSelectClose}
                onSelectCard={handleCardSelect}
            />
        </>
    );
}