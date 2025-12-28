import { GuestScreen } from './components/GuestScreen';
import { IbanBalance } from './components/IbanBalance';
import { TransactionsList } from './components/TransactionsList';
import { IbanController } from './IbanController';
import { SlimActionButton } from '@/components/Button/SlimActionButton';
import { MainLayout } from '@/components/common/MainLayout';
import { Document } from '@/components/Icons/Document';
import { Topup } from '@/components/Icons/Topup';
import { Transfer } from '@/components/Icons/Transfer';
import { IbanStatus, useIbanStore } from '@/states/iban/store';
import { Spinner, Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './IbanView.module.scss';

const IbanView: React.FC = () => {
    const [t] = useTranslation();
    const ibanAccount = useIbanStore(state => state.account);

    const isAccountOpened = ibanAccount?.status === IbanStatus.Activated;
    const isAccountNotOpened = !isAccountOpened;

    const openTopup = () => {
        useIbanStore.getState().openIbanAccountDetails();
    };

    const openTransfer = () => {
        useIbanStore.getState().openTransferModal();
    };

    const openAccountDetails = () => {
        useIbanStore.getState().openIbanAccountDetails();
    };

    if (!ibanAccount) {
        return (
            <MainLayout className={styles.loaderLayout}>
                <div className={styles.loaderWrap}>
                    <Spinner className={styles.spinner} />
                </div>
            </MainLayout>
        );
    }

    if (isAccountNotOpened) {
        return (
            <MainLayout>
                <GuestScreen
                    available={ibanAccount.available}
                    accountStatus={ibanAccount.status}
                />
            </MainLayout>
        );
    }

    return (
        <IbanController>
            <MainLayout>
                <div className={styles.head}>
                    <IbanBalance
                        balance={ibanAccount.balance || 0}
                        currency={ibanAccount.currency!}
                        balanceOnHold={ibanAccount.balanceOnHold || 0}
                        balanceFrozen={ibanAccount.balanceFrozen || 0}
                    />
                </div>

                <div className={styles.content}>
                    <div className={styles.account}>
                        <div className={styles.main}>
                            <SlimActionButton
                                icon={<Topup />}
                                onClick={openTopup}
                            >
                                {t('Top up')}
                            </SlimActionButton>

                            <SlimActionButton
                                icon={<Transfer />}
                                onClick={openTransfer}
                            >
                                {t('Transfer')}
                            </SlimActionButton>
                        </div>

                        <div
                            className={styles.accountDetails}
                            onClick={openAccountDetails}
                        >
                            <div className={styles.detailsHead}>
                                <div className={styles.detailsLabel}>
                                    <div className={styles.detailsIcon}><Document /></div>
                                    <Text
                                        type='captionSmall'
                                        weight='semibold'
                                        className={styles.detailsText}
                                    >
                                        {t('Account details')}
                                    </Text>
                                </div>
                            </div>

                            <div className={styles.bankAccount}>
                                <Text
                                    type='body'
                                    weight='medium'
                                    className={styles.accountLabel}
                                >
                                    {t('Account number')}
                                </Text>
                                <Text
                                    type='caption'
                                    weight='regular'
                                    className={styles.accountValue}
                                >
                                    {ibanAccount.iban}
                                </Text>
                            </div>

                            <Text
                                type='body'
                                weight='medium'
                                className={styles.detailsLink}
                            >
                                {t('Show all')}
                            </Text>
                        </div>
                    </div>

                    <TransactionsList />
                </div>
            </MainLayout>
        </IbanController>
    );
};

const IbanViewWithController: React.FC = () => {
    return (
        <IbanController>
            <IbanView />
        </IbanController>
    );
};

export { IbanViewWithController as IbanView };