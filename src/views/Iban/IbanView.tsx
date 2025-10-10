import { IbanBanners } from './components/Banners/IbanBanners';
import { GuestScreen } from './components/GuestScreen';
import { IbanBalance } from './components/IbanBalance';
import { IbanHead } from './components/IbanHead';
import { TransactionsList } from './components/TransactionsList';
import { IbanController } from './IbanController';
import { IbanActivationProgress } from '@/components/Activation/IbanActivationProgress';
import { SlimActionButton } from '@/components/Button/SlimActionButton';
import { MainLayout } from '@/components/common/MainLayout';
import { Document } from '@/components/Icons/Document';
import { Topup } from '@/components/Icons/Topup';
import { Transfer } from '@/components/Icons/Transfer';
import { IbanStatus, IbanVerificationStatus, useIbanStore } from '@/states/iban/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './IbanView.module.scss';

export function IbanView() {
    const [t] = useTranslation();
    const ibanAccount = useIbanStore(state => state.account!);

    const isIdle = ibanAccount.status === IbanStatus.Idle && ibanAccount.verificationStatus === IbanVerificationStatus.Idle;
    const isActivated = ibanAccount.status === IbanStatus.Activated && ibanAccount.verificationStatus === IbanVerificationStatus.Success;

    const isAccountOpening = ibanAccount.status === IbanStatus.InProgress;
    const isAccountFailed = ibanAccount.status === IbanStatus.Failed;

    const isVerificationInProgress = ibanAccount.verificationStatus === IbanVerificationStatus.InProgress;
    const isVerificationNeedAction = ibanAccount.verificationStatus === IbanVerificationStatus.NeedAction;
    const isVerificationFailed = ibanAccount.verificationStatus === IbanVerificationStatus.Failed;

    let balanceText: string | null = null;
    if (isVerificationInProgress) {
        balanceText = t('Verifying<br/>your data');
    } else if (isAccountOpening) {
        balanceText = t('Opening an<br/>account for you');
    } else if (isVerificationFailed || isAccountFailed || isVerificationNeedAction) {
        balanceText = t('Failed to<br/> open account');
    }

    const openTopup = () => {
        useIbanStore.getState().openIbanAccountDetails();
    };

    const openTransfer = () => {
        useIbanStore.getState().openTransferModal();
    };

    const openAccountDetails = () => {
        useIbanStore.getState().openIbanAccountDetails();
    };

    if (isIdle) {
        return (
            <MainLayout>
                <GuestScreen />
            </MainLayout>
        );
    }

    return (
        <IbanController>
            <MainLayout>
                <div className={styles.head}>
                    {isActivated ? <IbanBalance
                        balance={ibanAccount.balance || 0}
                        currency={ibanAccount.currency!}
                        balanceOnHold={ibanAccount.balanceOnHold || 0}
                        balanceFrozen={ibanAccount.balanceFrozen || 0}
                        balanceText={balanceText || undefined}
                        isActivated={isActivated}
                    /> : <>
                        <IbanHead />
                        <div className={styles.balancePlaceholder}>
                            <Text
                                type='body'
                                weight='regular'
                                align='left'
                                className={styles.balancePlaceholderText}
                            >
                                {t('EUR Account')}
                            </Text>

                            {balanceText && <div
                                className={styles.balancePlaceholderValue}
                                dangerouslySetInnerHTML={{ __html: balanceText }}
                            />}
                        </div>
                    </>}
                </div>

                <div className={styles.content}>
                    {isActivated && <div className={styles.account}>
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
                    </div>}


                    {!isIdle && !isActivated && <IbanActivationProgress
                        status={ibanAccount.status}
                        verificationStatus={ibanAccount.verificationStatus}
                    />}

                    {!isActivated && <IbanBanners className={styles.banners} />}
                    {isActivated && <TransactionsList />}
                </div>
            </MainLayout>
        </IbanController>
    );
}