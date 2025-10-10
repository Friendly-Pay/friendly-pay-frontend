
import { IbanAccountDetailsModal } from '@/components/Modals/IbanDetails/IbanAccountDetailsModal';
import { IbanRecipientModal } from '@/components/Modals/IbanRecipient/IbanRecipientModal';
import { IbanTransferModal } from '@/components/Modals/IbanTransfer/IbanTransferModal';
import { IbanStatus, IbanVerificationStatus, useIbanStore } from '@/states/iban/store';
import { useIbanTransferStore } from '@/states/iban/transfer';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function IbanController({ children }: PropsWithChildren) {
    const location = useLocation();
    const ibanStatus = useIbanStore(state => state.account!.status!);
    const ibanVerificationStatus = useIbanStore(state => state.account!.verificationStatus!);

    const isAccountOpening = ibanStatus === IbanStatus.InProgress;
    const isVerificationInProgress = ibanVerificationStatus === IbanVerificationStatus.InProgress;

    let refetchInterval = 30_000;
    if (isAccountOpening || isVerificationInProgress) {
        refetchInterval = 5_000;
    }

    useQuery({
        enabled: location.pathname === '/bank/account',
        queryKey: ['state.iban'],
        queryFn: async () => {
            const { account, accountFetchStatus, ibanAccountDetailsOpened, transferModalOpened, loadAccount } = useIbanStore.getState();
            if (ibanAccountDetailsOpened || transferModalOpened) {
                return account;
            }
            if (accountFetchStatus === 'pending') {
                return account;
            }
            return loadAccount();
        },
        staleTime: 30_000,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: refetchInterval,
        refetchOnWindowFocus: 'always',
        refetchIntervalInBackground: false
    });

    const isAccountActivated = ibanStatus === IbanStatus.Activated;
    useQuery({
        enabled: location.pathname === '/bank/account' && isAccountActivated,
        queryKey: ['state.iban.transactions'],
        queryFn: async () => {
            const { loadTransactions } = useIbanStore.getState();
            return loadTransactions({ limit: 100, offset: 0 }); // @TODO пагинация
        },
        staleTime: 15_000,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 15_000,
        refetchOnWindowFocus: 'always',
        refetchIntervalInBackground: false
    });

    useEffect(() => {
        const { ibanAccountDetailsOpened, transferModalOpened, closeIbanAccountDetails, closeTransferModal } = useIbanStore.getState();
        const { recipientModalOpened, closeRecipientModal } = useIbanTransferStore.getState();
        if (ibanAccountDetailsOpened) closeIbanAccountDetails();
        if (transferModalOpened) closeTransferModal();
        if (recipientModalOpened) closeRecipientModal();
        return () => {
            if (ibanAccountDetailsOpened) closeIbanAccountDetails();
            if (transferModalOpened) closeTransferModal();
            if (recipientModalOpened) closeRecipientModal();
        };
    }, [location]);

    return (<>
        {children}

        <IbanAccountDetailsModal />
        <IbanTransferModal />
        <IbanRecipientModal />
    </>);
}