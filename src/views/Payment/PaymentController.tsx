import { connectSocket, disconnectSocket } from '@/socket';
import { useSocketStore } from '@/socket/store';
import { PaymentStatus, PurchaseOrder, TopupOrder, usePaymentStore } from '@/states/payment/store';
import { HubConnectionState } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const useSocketConnection = (status: PaymentStatus | null) => {
    const socketState = useSocketStore(state => state.socketState);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        const connectStatuses = [PaymentStatus.Creating, PaymentStatus.Waiting];
        const disconnectStatuses = [PaymentStatus.Idle, PaymentStatus.Processing, PaymentStatus.Success, PaymentStatus.Failed];

        if (status && connectStatuses.includes(status)) {
            if (
                socketState !== HubConnectionState.Connected &&
                socketState !== HubConnectionState.Connecting &&
                socketState !== HubConnectionState.Reconnecting
            ) {
                connectSocket()
                    .then(success => {
                        if (!success) {
                            usePaymentStore.getState().startPoolingTransactionStatus();
                        } else {
                            usePaymentStore.getState().stopPoolingTransactionStatus();
                        }
                    });
            }
        } else if (status === null || disconnectStatuses.includes(status)) {
            if (
                socketState !== HubConnectionState.Disconnected &&
                socketState !== HubConnectionState.Disconnecting
            ) {
                disconnectSocket();
            }
        }
    }, [status]);
};

export const useTransactionStatusPooling = (
    type: PaymentType | null,
    order: TopupOrder | PurchaseOrder | null,
) => {
    const poolingTransactionStatus = usePaymentStore(state => state.poolingTransactionStatus);

    const timeout = useRef<any>();
    const refetchInterval = 10_000;
    useEffect(() => {
        const poolingTransaction = async () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            const transactionId = order?.transactionId;
            if (!transactionId) {
                return;
            }
            try {
                const { checkTopupTransactionStatus, checkPurchaseTransactionStatus } = usePaymentStore.getState();
                if (type === 'pay-new-card') {
                    await checkPurchaseTransactionStatus(transactionId);
                } else if (type === 'topup') {
                    await checkTopupTransactionStatus(transactionId);
                }
            } catch (error) {
                // @TODO устанавливать payment status failed
                console.error(error);
                toast.error('Failed to get tx status');
            }

            timeout.current = setTimeout(() => poolingTransaction(), refetchInterval);
        };

        if (poolingTransactionStatus) {
            poolingTransaction();
        }

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [poolingTransactionStatus]);
};

type PaymentType = 'topup' | 'pay-new-card'

export function PaymentController() {
    const topupOrder = usePaymentStore(state => state.topupOrder);
    const topupStatus = usePaymentStore(state => state.topupStatus);
    const purchaseOrder = usePaymentStore(state => state.purchaseOrder);
    const purchaseStatus = usePaymentStore(state => state.purchaseStatus);

    let order: TopupOrder | PurchaseOrder | null = null;
    let status: PaymentStatus | null = null;
    let paymentType: PaymentType | null = null;
    if (topupStatus !== PaymentStatus.Idle) {
        order = topupOrder;
        status = topupStatus;
        paymentType = 'topup';
    } else if (purchaseStatus !== PaymentStatus.Idle) {
        order = purchaseOrder;
        status = purchaseStatus;
        paymentType = 'pay-new-card';
    }

    useSocketConnection(status);
    useTransactionStatusPooling(paymentType, order);

    const location = useLocation();
    if (status === PaymentStatus.Processing || status === PaymentStatus.Success || status === PaymentStatus.Failed) {
        if (location.pathname === `/payments/${paymentType}`) {
            return <Navigate
                to={`/payments/${paymentType}/result`}
                replace
            />;
        }
    }
    if (
        location.pathname === '/payments/topup/result'
        || location.pathname === '/payments/pay-new-card/result'
    ) {
        if (!order) {
            return <Navigate
                to="/"
                replace
            />;
        }
    }

    return <Outlet />;
}