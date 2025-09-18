import { ExitButton } from '../components/ExitButton';
import { TransactionsList } from '../components/Transactions/TransactionsList';
import { TransferMethodButton } from '../components/TransferMethodButton';
import { useBankTransferStore } from '../state/store';
import { BankTransferMethod } from '../state/types';
import { MainLayout } from '@/components/common/MainLayout';
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
                        <BoxLogo />

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

const BoxLogo = () => {
    return (
        <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20.9004 0C26.8854 5.49943e-10 29.878 0.000347759 32.1641 1.16504C34.175 2.18969 35.8103 3.82496 36.835 5.83594C37.9997 8.12203 38 11.1146 38 17.0996V20.9004C38 26.8854 37.9997 29.878 36.835 32.1641C35.8103 34.175 34.175 35.8103 32.1641 36.835C29.878 37.9997 26.8854 38 20.9004 38H17.0996C11.1146 38 8.12203 37.9997 5.83594 36.835C3.82496 35.8103 2.18969 34.175 1.16504 32.1641C0.000347832 29.878 5.5314e-10 26.8854 0 20.9004V17.0996C5.49943e-10 11.1146 0.000347759 8.12203 1.16504 5.83594C2.18969 3.82496 3.82496 2.18969 5.83594 1.16504C8.12203 0.000347832 11.1146 5.5314e-10 17.0996 0H20.9004Z"
                fill="#08E8DE"
            />
            <path
                d="M33.1696 18.8806C32.8303 18.1561 32.098 17.6929 31.2952 17.6929H21.7869L28.6926 8.49401C28.8457 8.29023 28.6989 8 28.4444 8H25.606C25.4756 8 25.3535 8.06175 25.2749 8.16467L18.9732 16.5588L12.6716 8.16467C12.593 8.05969 12.4709 8 12.3405 8H9.50221C9.24773 8 9.10083 8.29023 9.25392 8.49401L16.1597 17.6929H4.74589C4.44388 17.6929 4.24313 18.0058 4.37144 18.2796L4.77699 19.1462C5.11617 19.8707 5.84863 20.3338 6.65125 20.3338H16.139L9.25177 29.506C9.09868 29.7097 9.24558 30 9.50006 30H12.3385C12.4688 30 12.591 29.9383 12.6696 29.8354L18.9712 21.4413L25.2729 29.8354C25.3515 29.9403 25.4735 30 25.6038 30H28.4423C28.6967 30 28.8436 29.7097 28.6905 29.506L21.8035 20.3338H33.1986C33.5006 20.3338 33.7012 20.021 33.573 19.7472L33.1675 18.8806H33.1696Z"
                fill="#131315"
            />
        </svg>
    );
};