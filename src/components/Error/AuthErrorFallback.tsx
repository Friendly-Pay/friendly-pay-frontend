import { AuthError } from './AuthError';
import { useAuthStore } from '@/states/auth/store';
import { useUserStore } from '@/states/user/store';
import { FetchStatus } from '@/utils/api';
import { PropsWithChildren } from 'react';

export function AuthErrorFallback({ children }: PropsWithChildren) {
    const authFetchStatus = useAuthStore((state) => state.authFetchStatus);
    const userFetchStatus = useUserStore((state) => state.userFetchStatus);
    if (authFetchStatus === FetchStatus.Rejected || userFetchStatus === FetchStatus.Rejected) {
        return <AuthError />;
    }

    return <>{children}</>;
}