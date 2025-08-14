import { TransferCard } from './components/Transfer/TransferCard';
import { TransferForm } from './components/Transfer/TransferForm';
import { MainLayout } from '@/components/common/MainLayout';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TransferBalance } from '@/components/Payment/Head/TransferBalance';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { Line, Text } from '@/uikit';
import balanceImage from 'assets/bonus/balance.png?inline';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styles from './BonusTransferView.module.scss';

export function BonusTransferView() {
    const [t] = useTranslation();
    const cardId = useFriendsBonusesStore(state => state.transferSelectedCardId);
    const balance = useFriendsBonusesStore(state => state.balance!);
    const balanceCurrency = useFriendsBonusesStore(state => state.balanceCurrency!);
    const transferMinAmount = useFriendsBonusesStore(state => state.transferMinAmount!);

    if (!cardId || balance === null) {
        return <Navigate
            to='/friends/bonus'
            replace
        />;
    }

    return (
        <MainLayout>
            <div className={styles.head}>
                <Text
                    type='headline'
                    align='center'
                    weight='semibold'
                >
                    Бонус на карту
                </Text>
            </div>

            <div className={styles.content}>
                <div className={styles.payment}>
                    <PaymentHead>
                        <TransferCard selectedCardId={cardId} />
                        <Line />
                        <TransferBalance
                            value={balance}
                            currency={balanceCurrency}
                            label={t('Bonus balance')}
                            image={balanceImage}
                        />
                    </PaymentHead>
                </div>

                <TransferForm
                    minAmount={transferMinAmount}
                    availableAmount={balance}
                />
            </div>
        </MainLayout>
    );
}