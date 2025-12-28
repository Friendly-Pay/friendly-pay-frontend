import { useUserStore, VerificationStatus } from '@/states/user/store';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

type UseUserVerificationPooling = () => [VerificationStatus, () => void, () => void];

const POLLING_INTERVAL = 5_000;

export const useUserVerificationPooling: UseUserVerificationPooling = () => {
    const user = useUserStore(state => state.user!);
    const [poolingActive, setPoolingActive] = useState(false);

    useQuery({
        enabled: poolingActive,
        queryKey: ['sumsub:status:pooling'],
        queryFn: async () => {
            const result = await useUserStore.getState().refetchUser();
            return result;
        },
        refetchInterval: poolingActive ? POLLING_INTERVAL : false,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        staleTime: 0,
        gcTime: 0,
        retry: true,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    const shouldContinuePolling = useMemo(() => {
        const finalStatuses: VerificationStatus[] = [
            VerificationStatus.Success,
            VerificationStatus.Failed
        ];

        return !finalStatuses.includes(user.verificationStatus);
    }, [user.verificationStatus]);

    useEffect(() => {
        if (poolingActive && !shouldContinuePolling) {
            setPoolingActive(false);
        }
    }, [poolingActive, shouldContinuePolling]);

    const startPolling = useCallback(() => {
        setPoolingActive(true);
    }, []);

    const stopPolling = useCallback(() => {
        setPoolingActive(false);
    }, []);

    const verificationStatus = user.verificationStatus;

    return [verificationStatus, startPolling, stopPolling];
};