import { TransactionWaiting } from '../components/TransactionWaiting';
import { MainLayout } from '@/components/common/MainLayout';
import { useBankTransferPaymentStore } from '@/states/payment/bankTransfer';
import { PaymentStatus } from '@/states/payment/store';
import { useBankTransferStore } from '@/views/BankTransfer/state/store';
import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

export function BankTransferWaitingView() {
    const order = useBankTransferPaymentStore(state => state.order);
    const status = useBankTransferPaymentStore(state => state.paymentStatus);

    const timeout = useRef<any>();
    const refetchInterval = 10_000;
    useEffect(() => {
        if (!order) {
            return;
        }

        const poolingTransaction = async () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            const transactionId = order?.transactionId;
            if (!transactionId) {
                return;
            }
            try {
                const { checkPaymentTransactionStatus } = useBankTransferPaymentStore.getState();
                await checkPaymentTransactionStatus(transactionId);
            } catch (error) {
                // @TODO устанавливать payment status failed
                console.error(error);
                toast.error('Failed to get tx status');
            }

            timeout.current = setTimeout(() => poolingTransaction(), refetchInterval);
        };

        poolingTransaction();

        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [order?.transactionId]);

    if (status === PaymentStatus.Processing || status === PaymentStatus.Success || status === PaymentStatus.Failed) {
        return <Navigate
            to={'/payments/bank-transfer/result'}
            replace
        />;
    }

    const selectedMethod = useBankTransferStore(state => state.selectedMethod);
    const selectedCountry = useBankTransferStore(state => state.selectedCountry);
    const selectedCurrency = useBankTransferStore(state => state.selectedCurrency);
    if (!order || !selectedMethod || !selectedCountry || !selectedCurrency) {
        return <Navigate
            to='/bank-transfer'
            replace
        />;
    }

    return (
        <MainLayout>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: 'var(--safe-area-top)', left: '44px', zIndex: '9999' }}
                onClick={() => useBankTransferPaymentStore.getState().completePayment(1234)}
            >Confirm</button>}

            <TransactionWaiting type='bank-transfer' />
        </MainLayout>
    );
}