import { CardProduct } from './components/CardProduct';
import { MainLayout } from '@/components/common/MainLayout';
import { Legal } from '@/components/Legal/Legal';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewProductView.module.scss';

const CARD_TYPE_ORDER = [111035, 111028];

export function NewProductView() {
    const cardsTypes = useCardsStore(state => state.cardsTypes);

    const availableCards = useMemo(() => {
        if (!cardsTypes) return [];
        const available = Object.values(cardsTypes).filter(card => card.available);
        const orderMap = new Map();
        CARD_TYPE_ORDER.forEach((id, index) => orderMap.set(id, index));

        return available.sort((a, b) => {
            const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
            const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
            return orderA - orderB;
        });
    }, [cardsTypes]);

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
            <Legal className={styles.legal} />
        </MainLayout>
    );
}