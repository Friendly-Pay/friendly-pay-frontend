import { CardProduct } from './components/CardProduct';
import { MainLayout } from '@/components/common/MainLayout';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewProductView.module.scss';

export function NewProductView() {
    const cardsTypes = useCardsStore(state => state.cardsTypes);

    // const availableCards = useMemo(() => {
    //     if (!cardsTypes || !myCardsTypesIds) return [];
    //     return Object.values(cardsTypes).filter(card => card.available && !myCardsTypesIds.includes(card.id));
    // }, [cardsTypes, myCardsTypesIds]);

    const availableCards = useMemo(() => {
        if (!cardsTypes) return [];
        return Object.values(cardsTypes).filter(card => card.available);
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