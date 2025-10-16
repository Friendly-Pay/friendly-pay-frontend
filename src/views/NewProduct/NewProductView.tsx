import { CardProduct } from './components/CardProduct';
import { MainLayout } from '@/components/common/MainLayout';
import { useCardsStore } from '@/states/cards/store';
import { PaymentActions } from '@/states/payment/actions';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewProductView.module.scss';

const CARD_TYPE_ORDER = [111036, 111032, 111031, 111029, 111028];

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
        PaymentActions.purchaseCard(cardTypeId, navigate);
    };

    return (
        <MainLayout>
            <div className={styles.list}>
                {availableCards.map(card => (
                    <CardProduct
                        key={card.id}
                        name={card.name}
                        price={card.price}
                        cashback={card.cashback}
                        expireDays={card.expireDays}
                        depositFee={card.depositFee}
                        description={card.description}
                        virtual={card.isVirtual}
                        limits={card.limits}
                        typeId={card.id}
                        paymentSystem={card.paymentSystem}
                        hasApplePay={card.hasAppleWallet}
                        hasGoogleWallet={card.hasGooglePay}
                        className={styles.card}
                        onCardSelect={() => handleCardSelect(card.id)}
                    />
                ))}
            </div>
        </MainLayout>
    );
}