import { TransactionWaiting } from '../components/TransactionWaiting';
import { MainLayout } from '@/components/common/MainLayout';
import { useBankCard } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './TopupWaitingView.module.scss';

export function TopupWaitingView() {
    const [t] = useTranslation();
    const cardId = usePaymentStore(state => state.topupSelectedCardId);
    const bankCard = useBankCard(cardId);

    return (
        <MainLayout>
            {import.meta.env.DEV && <button
                style={{ position: 'absolute', top: 'var(--safe-area-top)', left: '44px', zIndex: '9999' }}
                onClick={() => usePaymentStore.getState().completeTopup(
                    usePaymentStore.getState().topupOrder!.transactionId, 1000, 'usd'
                )}
            >Confirm</button>}

            <TransactionWaiting type='topup'>
                {bankCard?.number && <Text
                    type='caption'
                    align='center'
                    weight='medium'
                    className={styles.bankAccount}
                >
                    {t('Account')} <span>{formatCardLastFourDigits(bankCard.number)}</span>
                </Text>}
            </TransactionWaiting>
        </MainLayout>
    );
}