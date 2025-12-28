import { PaymentButtonsProvider } from './buttonsContext';
import { Routes } from '@/routes';
import { OrderStorage } from '@/states/payment/storage';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

OrderStorage.cleanupExpired();

/**
 * API Polling статуса транзакции пополнения или покупки карты
 */
export const useTransactionStatusPooling = (status: PaymentStatus | null) => {
    const [t] = useTranslation();
    const poolingTransactionStatus = usePaymentStore(state => state.poolingTransactionStatus);
    const startPoolingTransactionStatus = usePaymentStore(state => state.startPoolingTransactionStatus);
    const stopPoolingTransactionStatus = usePaymentStore(state => state.stopPoolingTransactionStatus);

    useEffect(() => {
        if (status === PaymentStatus.ReadyForPayment || status === PaymentStatus.Waiting) {
            startPoolingTransactionStatus();
            return () => {
                stopPoolingTransactionStatus();
            };
        }
    }, [status]);

    useEffect(() => {
        let timerId = 0;

        const clearTimer = () => {
            if (timerId) {
                clearTimeout(timerId);
                timerId = 0;
            }
        };

        const poolingTransaction = async () => {
            clearTimer();

            const poolingStatuses = [PaymentStatus.ReadyForPayment, PaymentStatus.Waiting];
            const {
                purchaseStatus,
                topupStatus,
                purchaseOrder,
                topupOrder,
                checkTopupTransactionStatus,
                checkPurchaseTransactionStatus,
                stopPoolingTransactionStatus
            } = usePaymentStore.getState();

            const refetchInterval = topupStatus === PaymentStatus.Waiting || purchaseStatus === PaymentStatus.Waiting
                ? 5_000
                : 10_000;

            try {
                if (poolingStatuses.includes(topupStatus) && topupOrder) {
                    // Пополнение
                    await checkTopupTransactionStatus(topupOrder.transactionId);
                } else if (poolingStatuses.includes(purchaseStatus) && purchaseOrder) {
                    // Покупка карты
                    await checkPurchaseTransactionStatus(purchaseOrder.transactionId);
                } else {
                    stopPoolingTransactionStatus();
                }
            } catch (error) {
                console.error(error);
                toast.error(t('Failed to get payment status, please contact support if the error persists'));
            } finally {
                if (usePaymentStore.getState().poolingTransactionStatus) {
                    timerId = setTimeout(() => poolingTransaction(), refetchInterval);
                }
            }
        };

        if (poolingTransactionStatus) {
            timerId = setTimeout(() => poolingTransaction(), 5_000);
        }

        return () => {
            clearTimer();
        };
    }, [poolingTransactionStatus]);
};

export type PaymentType = 'TOPUP' | 'CARD_PURCHASE'

const paymentRedirects: Record<PaymentType, Partial<Record<PaymentStatus, string>>> = {
    TOPUP: {
        [PaymentStatus.Waiting]: Routes.TOPUP_WAITING,
        [PaymentStatus.Processing]: Routes.TOPUP_RESULT,
        [PaymentStatus.Success]: Routes.TOPUP_RESULT,
        [PaymentStatus.Failed]: Routes.TOPUP_RESULT
    },
    CARD_PURCHASE: {
        [PaymentStatus.Waiting]: Routes.CARD_PURCHASE_WAITING,
        [PaymentStatus.Processing]: Routes.HOME,
        [PaymentStatus.Success]: Routes.HOME,
        [PaymentStatus.Failed]: Routes.HOME,
    }
};

// @TODO добавить expireAt учет для активного платежа
export function PaymentController() {
    const topupStatus = usePaymentStore(state => state.topupStatus);
    const purchaseStatus = usePaymentStore(state => state.purchaseStatus);

    const navigate = useNavigate();

    let status: PaymentStatus | null = null;
    let paymentType: PaymentType | null = null;
    if (topupStatus !== PaymentStatus.Idle) {
        status = topupStatus;
        paymentType = 'TOPUP';
    } else if (purchaseStatus !== PaymentStatus.Idle) {
        status = purchaseStatus;
        paymentType = 'CARD_PURCHASE';
    }

    useTransactionStatusPooling(status);

    // Редирект
    useEffect(() => {
        if (!paymentType || !status) {
            return;
        }

        const redirectUrl = paymentRedirects[paymentType][status];
        if (!redirectUrl || redirectUrl === location.pathname) {
            return;
        }

        navigate(redirectUrl);
    }, [paymentType, status]);

    return (
        <PaymentButtonsProvider>
            <Outlet />
        </PaymentButtonsProvider>
    );
}

// const useSocketConnection = (status: PaymentStatus | null) => {
//     const socketState = useSocketStore(state => state.socketState);

//     useEffect(() => {
//         return () => {
//             disconnectSocket();
//         };
//     }, []);

//     useEffect(() => {
//         const connectStatuses = [PaymentStatus.ReadyForPayment, PaymentStatus.Waiting];
//         const disconnectStatuses = [PaymentStatus.Idle, PaymentStatus.Processing, PaymentStatus.Success, PaymentStatus.Failed];

//         if (status && connectStatuses.includes(status)) {
//             if (
//                 socketState !== HubConnectionState.Connected &&
//                 socketState !== HubConnectionState.Connecting &&
//                 socketState !== HubConnectionState.Reconnecting
//             ) {
//                 connectSocket()
//                     .then(success => {
//                         if (!success) {
//                             usePaymentStore.getState().startPoolingTransactionStatus();
//                         } else {
//                             usePaymentStore.getState().stopPoolingTransactionStatus();
//                         }
//                     });
//             }
//         } else if (status === null || disconnectStatuses.includes(status)) {
//             if (
//                 socketState !== HubConnectionState.Disconnected &&
//                 socketState !== HubConnectionState.Disconnecting
//             ) {
//                 disconnectSocket();
//             }
//         }
//     }, [status]);
// };