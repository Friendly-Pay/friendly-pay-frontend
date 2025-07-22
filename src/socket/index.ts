import { useSocketStore } from './store';
import { DepositProcessing, PurchaseCompleted } from './types';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';

const SOCKET_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/main`;

export let hubConnection: HubConnection | null = null;

/* eslint-disable no-console */
export const createSocketConnection = (accessToken: string) => {
    hubConnection = new HubConnectionBuilder()
        .withUrl(SOCKET_URL, {
            accessTokenFactory: async () => accessToken,
            transport: HttpTransportType.WebSockets,
            withCredentials: true,
            skipNegotiation: true
        })
        .withAutomaticReconnect([])
        .configureLogging(import.meta.env.DEV ? LogLevel.Debug : LogLevel.None)
        .build();

    hubConnection.onreconnecting(async error => {
        console.warn('[socket] reconnecting', error);
        useSocketStore.getState().setSocketState(HubConnectionState.Reconnecting);
    });

    hubConnection.onreconnected(async () => {
        console.warn('[socket] reconnected');
        useSocketStore.getState().setSocketState(HubConnectionState.Connected);
        await disconnectSocket();
    });

    hubConnection.onclose(error => {
        console.warn('[socket] closed', error);
        useSocketStore.getState().setSocketState(HubConnectionState.Disconnected);

        const { topupStatus, purchaseStatus, startPoolingTransactionStatus } = usePaymentStore.getState();
        if (
            topupStatus === PaymentStatus.Creating
            || topupStatus === PaymentStatus.Waiting
            || purchaseStatus === PaymentStatus.Creating
            || purchaseStatus === PaymentStatus.Waiting) {
            startPoolingTransactionStatus();
        }
    });

    hubConnection.on('PurchaseCompleted', async (data: PurchaseCompleted) => {
        console.log('[socket] PurchaseCompleted event', data);
        usePaymentStore.getState().completeCardPurchase(data.transactionId);
    });

    hubConnection.on('DepositProcessing', async (data: DepositProcessing) => {
        console.log('[socket] DepositProcessing event', data);
        usePaymentStore.getState().completeTopup(data.transactionId, data.amount, data.currency);
    });
};

export const connectSocket = async () => {
    if (!hubConnection) {
        console.warn('[socket] try to connect to undefined hub');
        return;
    }
    if (
        hubConnection.state === HubConnectionState.Connected ||
        hubConnection.state === HubConnectionState.Connecting
    ) {
        console.log('[socket] already connected or connecting');
        return;
    }

    const setSocketState = useSocketStore.getState().setSocketState;
    try {
        setSocketState(HubConnectionState.Connecting);
        await hubConnection.start();
        setSocketState(HubConnectionState.Connected);
        return true;
    } catch (error) {
        console.error('[socket] failed to connect', error);
        setSocketState(HubConnectionState.Disconnected);
        return false;
    }
};

export const disconnectSocket = async () => {
    if (!hubConnection) {
        console.warn('[socket] try to stop undefined hub');
        return;
    }
    if (hubConnection.state === HubConnectionState.Disconnected) {
        console.log('[socket] already disconnected');
        return;
    }

    try {
        await hubConnection.stop();
        useSocketStore.getState().setSocketState(HubConnectionState.Disconnected);
    } catch (error) {
        console.error('[socket] failed to disconnect', error);
    }
};