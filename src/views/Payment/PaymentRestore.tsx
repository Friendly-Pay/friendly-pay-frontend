import { OrderStorage } from '@/states/payment/storage';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { PropsWithChildren, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function PaymentRestore({ children }: PropsWithChildren) {
    const initialTopupOrder = useUserStore((state) => state.initialTopupOrder);
    const initialPurchaseOrder = useUserStore((state) => state.initialPurchaseOrder);
    const resetInitialsPaymentOrders = useUserStore((state) => state.resetInitialsPaymentOrders);

    const restoreTopup = usePaymentStore((state) => state.restoreTopup);
    const restoreCardPurchase = usePaymentStore((state) => state.restoreCardPurchase);

    useEffect(() => {
        resetInitialsPaymentOrders();
    }, []);

    if (initialPurchaseOrder) {
        const order = OrderStorage.get(initialPurchaseOrder.transactionId);
        if (order?.status !== PaymentStatus.UserHiddenWaiting) {
            restoreCardPurchase(initialPurchaseOrder);
            return <Navigate
                to="/payments/pay-new-card"
                replace
            />;
        }
    }

    if (initialTopupOrder) {
        const order = OrderStorage.get(initialTopupOrder.transactionId);
        if (order?.status !== PaymentStatus.UserHiddenWaiting) {
            restoreTopup(initialTopupOrder);
            return <Navigate
                to="/payments/topup"
                replace
            />;
        }
    }

    return <>{children}</>;
}