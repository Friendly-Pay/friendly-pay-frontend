import { CardStatus } from './store';

export const isCardDisabled = (status: CardStatus): boolean =>
    // status === CardStatus.NeedActivation ||
    status === CardStatus.ActivationFailed ||
    status === CardStatus.VerificationFailed;

export const isCardActivationInProgress = (status: CardStatus): boolean =>
    status === CardStatus.ActivationProcessing ||
    status === CardStatus.VerificationProcessing;