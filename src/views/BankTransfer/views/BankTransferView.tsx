import { ExitButton } from '../components/ExitButton';
import { TransactionsList } from '../components/Transactions/TransactionsList';
import { TransferMethodButton } from '../components/TransferMethodButton';
import { useBankTransferStore } from '../state/store';
import { BankTransferMethod } from '../state/types';
import { MainLayout } from '@/components/common/MainLayout';
import { FriendlyPayBox } from '@/components/Icons/FriendlyPay';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './BankTransferView.module.scss';

export function BankTransferView() {
    const [t] = useTranslation();
    const transactions = useBankTransferStore(state => state.transactions);

    const navigate = useNavigate();
    const handleStartTransfer = (method: BankTransferMethod) => {
        useBankTransferStore.getState().setMethod(method);
        navigate('/bank-transfer/country');
    };

    return (
        <MainLayout className={styles.layout}>
            <div className={styles.main}>
                <ExitButton />
                <div className={styles.background}></div>
                <div className={styles.head}>
                    <div className={styles.brand}>
                        <FriendlyPayBox />
                        <Text
                            type='headlineLarge'
                            align='left'
                            weight='semibold'
                            className={styles.title}
                        >{t('Transfers')}</Text>
                    </div>
                </div>

                <div className={styles.transfer}>
                    <Text
                        type='body'
                        align='left'
                        weight='medium'
                        className={styles.label}
                    >{t('Choose method')}</Text>

                    <div className={styles.methods}>
                        <TransferMethodButton
                            method={BankTransferMethod.BankTransfer}
                            onClick={() => handleStartTransfer(BankTransferMethod.BankTransfer)}
                        />
                        {/* <TransferMethodButton
                            method={BankTransferMethod.GlobalBankTransfer}
                            onClick={() => handleStartTransfer(BankTransferMethod.GlobalBankTransfer)}
                        /> */}
                    </div>
                </div>
            </div>

            <div className={styles.history}>
                <Text
                    type='title'
                    align='left'
                    weight='medium'
                    className={styles.headline}
                >{t('History')}</Text>
                <TransactionsList transactions={transactions} />
            </div>
        </MainLayout>
    );
}