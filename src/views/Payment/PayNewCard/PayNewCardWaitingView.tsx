import { TransactionWaiting } from '../components/TransactionWaiting';
import { MainLayout } from '@/components/common/MainLayout';
import { usePaymentStore } from '@/states/payment/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';

export function PayNewCardWaitingView() {
    const [t] = useTranslation();
    return (
        <MainLayout>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: 'var(--safe-area-top)', left: '44px', zIndex: '9999' }}
                onClick={() => usePaymentStore.getState().completeCardPurchase(
                    usePaymentStore.getState().purchaseOrder!.transactionId
                )}
            >Confirm</button>}

            <TransactionWaiting type='purchase'>
                <Text
                    type='caption'
                    align='center'
                    weight='regular'
                >
                    {t('Card issuance')}
                </Text>
            </TransactionWaiting>
        </MainLayout>
    );
}