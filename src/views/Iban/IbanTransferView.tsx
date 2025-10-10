import { IbanRecipient } from './components/Transfer/IbanRecipient';
import { SepaTransferForm } from './components/Transfer/SepaTransferForm';
import { IbanController } from './IbanController';
import { MainLayout } from '@/components/common/MainLayout';
import { PaymentHead } from '@/components/Payment/Head/PaymentHead';
import { TransferBalance } from '@/components/Payment/Head/TransferBalance';
import { useIbanStore } from '@/states/iban/store';
import { useIbanTransferStore } from '@/states/iban/transfer';
import { Line, Text } from '@/uikit';
import euro from 'assets/iban/eur.png';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styles from './IbanTransferView.module.scss';

export function IbanTransferView() {
    const [t] = useTranslation();
    const ibanAccount = useIbanStore(state => state.account);
    const transferRecipientType = useIbanTransferStore(state => state.transfer.recipientType);

    if (!ibanAccount || ibanAccount.balance === null || ibanAccount.currency === null) {
        return (<Navigate
            to='/bank/account'
            replace
        />);
    }

    return (
        <IbanController>
            <MainLayout fullHeight>
                <div className={styles.head}>
                    <Text
                        type='headline'
                        align='center'
                        weight='semibold'
                    >
                        {t('Within Europe')}
                    </Text>
                </div>

                <div className={styles.content}>
                    <div className={styles.payment}>
                        <PaymentHead>
                            <TransferBalance
                                value={ibanAccount.balance}
                                currency={ibanAccount.currency}
                                label={t('Debit account')}
                                image={euro}
                            />
                            <Line />
                            <IbanRecipient recipientType={transferRecipientType} />
                        </PaymentHead>

                        <Text
                            type='captionSmall'
                            align='left'
                            weight='regular'
                            className={styles.info}
                        >
                            {t('Credited instantly, sometimes 1–2 days')}
                        </Text>
                    </div>

                    <SepaTransferForm />
                </div>
            </MainLayout>
        </IbanController>
    );
}