import { SumsubIcons, SumsubTexts } from './types';
import { VerificationStatus } from '@/states/user/store';
import { FetchStatus } from '@/utils/api';
import { createContext } from 'react';

export interface TSumsubContext {
    texts: Partial<SumsubTexts>,
    icons: Partial<SumsubIcons>,
    cardTypeId: number;
    verificationStatus: VerificationStatus;
    sumsubLinkFetchStatus: FetchStatus;
    handleKycStart: () => Promise<void>;
    handleKycRepeat: () => Promise<void>;
    handleOpenSupport: () => void;
    handleOpenCardPurchase: () => void;
    handleCancel: () => void;
}

const mockFn = () => Promise.resolve();

export const SumsubContext = createContext<TSumsubContext>({
    texts: {},
    icons: {},
    cardTypeId: 0,
    verificationStatus: VerificationStatus.Idle,
    sumsubLinkFetchStatus: FetchStatus.Idle,
    handleKycStart: mockFn,
    handleKycRepeat: mockFn,
    handleOpenSupport: mockFn,
    handleOpenCardPurchase: mockFn,
    handleCancel: mockFn
});