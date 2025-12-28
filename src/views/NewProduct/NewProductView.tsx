import { CardProduct } from './components/CardProduct';
import { MainLayout } from '@/components/common/MainLayout';
import { Routes } from '@/routes';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { isSumsubNotCompleted, useSumsubStore } from '@/states/sumsub/store';
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

    // @TODO вынести в класс BankCardActions (логика с картой будет в одном месте)
    const handleCardSelect = async (cardTypeId: number) => {
        if (isSumsubNotCompleted()) {
            useSumsubStore.getState().setSelectedCardTypeId(cardTypeId);
            navigate(Routes.SUMSUB_START);
            return;
        }

        usePaymentStore.getState().startCardPurchase(cardTypeId);
        navigate(Routes.CARD_PURCHASE);
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