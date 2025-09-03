import { CardProduct } from './components/CardProduct';
import { MainLayout } from '@/components/common/MainLayout';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewProductView.module.scss';

const CARD_ID_SORT = [
    111034,
    111028
];

export function NewProductView() {
    const cardsTypes = useCardsStore(state => state.cardsTypes);

    const orderMap = useMemo(() => new Map<number, number>(CARD_ID_SORT.map((id, i) => [id, i])), []);
    const availableCards = useMemo(() => {
        if (!cardsTypes) return [];
        return Object.values(cardsTypes)
            .filter(card => card.available)
            .sort((a, b) => {
                const ai = orderMap.get(a.id) ?? Number.POSITIVE_INFINITY;
                const bi = orderMap.get(b.id) ?? Number.POSITIVE_INFINITY;
                if (ai !== bi) return ai - bi;
                return a.id - b.id;
            });
    }, [cardsTypes, orderMap]);

    const navigate = useNavigate();
    const handleCardSelect = async (cardTypeId: number) => {
        navigate('/payments/pay-new-card');
        usePaymentStore.getState().startCardPurchase(cardTypeId);
    };

    return (
        <MainLayout>
            <div className={styles.list}>
                {availableCards.map(card => (
                    <CardProduct
                        key={card.id}
                        name={card.name}
                        price={card.price}
                        depositFee={card.depositFee}
                        description={card.description}
                        virtual={card.isVirtual}
                        limits={card.limits}
                        typeId={card.id}
                        paymentSystem={card.paymentSystem}
                        className={styles.card}
                        onCardSelect={() => handleCardSelect(card.id)}
                    />
                ))}
            </div>
        </MainLayout>
    );
}