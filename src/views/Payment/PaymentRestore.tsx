import { Routes } from '@/routes';
import { OrderStorage } from '@/states/payment/storage';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { useUserStore, VerificationStatus } from '@/states/user/store';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export function PaymentRestore({ children }: PropsWithChildren) {
    const sumsubStatus = useUserStore((state) => state.user?.verificationStatus);
    const initialTopupOrder = useUserStore((state) => state.initialTopupOrder);
    const initialPurchaseOrder = useUserStore((state) => state.initialPurchaseOrder);
    const initialPurchaseCardTypeId = useUserStore((state) => state.initialPurchaseCardTypeId);
    const resetInitialPaymentOrders = useUserStore((state) => state.resetInitialPaymentOrders);
    const resetInitualPurchaseCardTypeId = useUserStore((state) => state.resetInitualPurchaseCardTypeId);

    const startCardPurchase = usePaymentStore((state) => state.startCardPurchase);

    const restoreTopup = usePaymentStore((state) => state.restoreTopup);
    const restoreCardPurchase = usePaymentStore((state) => state.restoreCardPurchase);

    const [isMounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);

        if (isMounted) {
            resetInitialPaymentOrders();
            resetInitualPurchaseCardTypeId();
        }
    }, [isMounted]);

    if (initialPurchaseOrder) {
        const order = OrderStorage.get(initialPurchaseOrder.transactionId);
        if (order?.status !== PaymentStatus.UserHiddenWaiting) {
            restoreCardPurchase(initialPurchaseOrder);
            return <Navigate
                to={Routes.CARD_PURCHASE}
                replace
            />;
        }
    }

    if (initialTopupOrder) {
        const order = OrderStorage.get(initialTopupOrder.transactionId);
        if (order?.status !== PaymentStatus.UserHiddenWaiting) {
            restoreTopup(initialTopupOrder);
            return <Navigate
                to={Routes.TOPUP}
                replace
            />;
        }
    }

    // Переход к покупке выбранной карты
    if (initialPurchaseCardTypeId && sumsubStatus === VerificationStatus.Success) {
        startCardPurchase(initialPurchaseCardTypeId);
        return <Navigate
            to={Routes.CARD_PURCHASE}
            replace
        />;
    }

    if (!isMounted) {
        return null;
    }

    return <>{children}</>;
}