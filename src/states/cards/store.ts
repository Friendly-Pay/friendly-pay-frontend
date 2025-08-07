import { activateCard, ActivateCardData, CardDetailsResponse, fetchCardDetails, fetchCardTypes, fetchMyCards } from './fetch';
import { FetchStatus } from '@/utils/api';
import i18next from 'i18next';
import { toast } from 'sonner';
import { create } from 'zustand';

export enum PaymentSystem {
    Visa = 'visa',
    Mastercard = 'mastercard'
}

export interface CardLimits {
    purchase: { day: number; transaction: number };
    atm: { day: number; transaction: number } | null;
    deposit: { day: number; transaction: number };
}

interface CardType {
    id: number;
    name: string;
    description?: string;
    paymentSystem: PaymentSystem;
    price: number;
    isVirtual: boolean;
    minDeposit: number;
    depositFee: number;
    depositTime: number;
    hasGooglePay: boolean;
    hasAppleWallet: boolean;
    canWithdrawalAtm: boolean;
    available: boolean;
    limits: CardLimits;
}

export enum CardStatus {
    Active = 'Active',
    NeedActivation = 'NeedActivation',
    ActivationProcessing = 'ActivationProcessing',
    VerificationProcessing = 'VerificationProcessing',
    VerificationFailed = 'VerificationFailed',
    ActivationFailed = 'ActivationFailed',
    Frozen = 'Frozen'
}

export enum CardTransactionType {
    DEPOSIT = 'deposit',
    PAYMENT = 'payment',
    REFUND = 'refund', // Возврат покупки
    VOID = 'void' // Отмена покупки
}

export enum CardTransactionStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    IN_PROGRESS = 'in-progress'
}

export interface CardTransaction {
    id: number;
    type: CardTransactionType;
    status: CardTransactionStatus;
    amount: number;
    currency: string;
    originalAmount: number;
    originalCurrency: string;
    fee: number;
    remark: string;
    createdAt: number; // unix timestamp
}

export interface MyCard extends Omit<CardType, 'id'> {
    id: number;
    typeId: number;
    number: string | null; // null если карта не активирована
    canDeposit: boolean;
    status: CardStatus;
    balance: number;
    currency: string;
    createdAt: number;
    transactions: CardTransaction[];
}

export interface CardDetails {
    number: string;
    cvv: number;
    expireAt: number;
}

interface State {
    selectedCardId: number | null;
    myCards: Record<number, MyCard> | null;
    myCardsIds: number[] | null;
    myCardsCount: number;
    myCardsTypesIds: number[] | null;
    myCardsUpdatedAt: number | null;
    myCardsFetchStatus: FetchStatus;
    cardsTypes: Record<number, CardType> | null;
    cardsTypesFetchStatus: FetchStatus;
    topupModal: { opened: boolean };
    detailsModal: { data: CardDetails | null, opened: boolean };
    detailsFetchStatus: FetchStatus;
    transactionDetailsModal: { data: CardTransaction | null, opened: boolean };
}

interface Actions {
    setSelectedCardId: (cardId: number | null) => void;
    loadMyCards: () => Promise<number[] | void>;
    loadCardsTypes: () => Promise<void>;
    openTopupModal: () => void;
    closeTopupModal: () => void;
    openCardDetails: () => void;
    closeCardDetails: () => void;
    fetchCardDetails: () => Promise<CardDetailsResponse | void>;
    openTransactionDetails: (data: CardTransaction) => void;
    closeTransactionDetails: () => void;
    resetTransactionDetails: () => void;
    activateCard: (data: ActivateCardData) => Promise<void>;
}

// @TODO завести класс CardActions (тут оставить только логику работы с данными) а в него вынести все ручки (в том числе и загрузку)
export const useCardsStore = create<State & Actions>((set, get) => ({
    selectedCardId: null,
    cardsTypes: null,
    cardsTypesFetchStatus: FetchStatus.Idle,
    myCards: null,
    myCardsIds: null,
    myCardsCount: 0,
    myCardsTypesIds: null,
    myCardsUpdatedAt: null,
    myCardsFetchStatus: FetchStatus.Idle,
    topupModal: { opened: false },
    detailsModal: { data: null, opened: false },
    detailsFetchStatus: FetchStatus.Idle,
    transactionDetailsModal: { data: null, opened: false },

    setSelectedCardId: (cardId) => set({ selectedCardId: cardId }),

    loadCardsTypes: async () => {
        set({ cardsTypesFetchStatus: FetchStatus.Pending });
        try {
            const res = await fetchCardTypes();
            const cardsTypes: Record<number, CardType> = {};
            for (const item of res) {
                let paymentSystem: any;
                switch (item.paymentSystem) {
                    case 'Visa':
                        paymentSystem = PaymentSystem.Visa;
                        break;
                    case 'Mastercard':
                        paymentSystem = PaymentSystem.Mastercard;
                        break;
                }
                if (!paymentSystem) throw new Error(`[loadCardsTypes] unknown payment system ${paymentSystem}`);
                cardsTypes[item.id] = {
                    ...item,
                    paymentSystem
                };
            }
            set({
                cardsTypes,
                cardsTypesFetchStatus: FetchStatus.Fulfilled,
            });
        } catch (error) {
            console.error('[error]', error);
            set({ cardsTypesFetchStatus: FetchStatus.Rejected });
        }
    },

    loadMyCards: async () => {
        const { cardsTypes } = get();
        if (!cardsTypes) {
            throw new Error('[cards] undefined cards types');
        }
        set({ myCardsFetchStatus: FetchStatus.Pending });
        try {
            const myCards = await fetchMyCards();
            const sortedCards = [...myCards].sort((a, b) => b.createdAt - a.createdAt);

            const cardsIds: number[] = [];
            const cardsTypesIds: number[] = [];
            const cardsHashMap: Record<number, MyCard> = {};
            for (const card of sortedCards) {
                const cardType = cardsTypes[card.typeId];
                if (!cardType) throw new Error(`[cards] undefined type ${card.typeId}`);
                cardsIds.push(card.id);
                cardsTypesIds.push(card.typeId);
                cardsHashMap[card.id] = {
                    ...cardType,
                    id: card.id,
                    typeId: card.typeId,
                    number: card.number,
                    canDeposit: card.canDeposit,
                    status: card.status as CardStatus,
                    balance: card.balance,
                    currency: card.currency,
                    createdAt: card.createdAt,
                    transactions: card.transactions as CardTransaction[],
                };
            }

            set(state => {
                const initialCardId = cardsIds.length ? cardsIds[0] : null;
                return {
                    selectedCardId: state.selectedCardId ?? initialCardId,
                    myCards: cardsHashMap,
                    myCardsIds: cardsIds,
                    myCardsCount: cardsIds.length,
                    myCardsTypesIds: cardsTypesIds,
                    myCardsUpdatedAt: Date.now(),
                    myCardsFetchStatus: FetchStatus.Fulfilled,
                };
            });
            return cardsIds;
        } catch (error: any) {
            console.error('[error]', error);
            toast.error(i18next.t('Failed to refresh account data. Please try restarting the app or pulling down to refresh'));
            set({ myCardsFetchStatus: FetchStatus.Rejected });
        }
    },

    openTopupModal: () => set({ topupModal: { opened: true } }),
    closeTopupModal: () => set({ topupModal: { opened: false } }),

    openCardDetails: () => set({ detailsModal: { data: null, opened: true } }),
    closeCardDetails: () => set({ detailsModal: { data: null, opened: false } }),

    fetchCardDetails: async () => {
        const { detailsModal, selectedCardId } = get();
        try {
            if (!detailsModal.opened) return;
            if (!selectedCardId) throw new Error('Card not selected');
            const detail = await fetchCardDetails(selectedCardId);
            set(state => ({
                detailsModal: {
                    data: detail,
                    opened: state.detailsModal.opened
                },
            }));
            return detail;
        } catch (error: any) {
            console.error('[loadCardDetails]', error);
            toast.error(i18next.t('Failed to fetch card data. Please try reopening the details window'));
        }
    },

    openTransactionDetails: (data) => {
        set({
            transactionDetailsModal: {
                data,
                opened: true
            }
        });
    },
    closeTransactionDetails: () => {
        set(state => ({
            transactionDetailsModal: {
                ...state.transactionDetailsModal,
                opened: false
            }
        }));
    },
    resetTransactionDetails: () => {
        set(state => ({
            transactionDetailsModal: {
                ...state.transactionDetailsModal,
                data: null
            }
        }));
    },

    activateCard: async (activateData) => {
        const myCards = get().myCards;
        if (!myCards) {
            console.warn('[activateCard] myCards is null');
            return;
        }
        const cardData = myCards[activateData.cardId];
        if (!cardData) throw new Error(`[activateCard] card ${activateData.cardId} undefined`);
        if (cardData.status !== CardStatus.NeedActivation) {
            return;
        }
        await activateCard(activateData);
    }
}));


export const useBankCard = (cardId: number | null) => {
    const myCards = useCardsStore(state => state.myCards);
    return cardId && myCards ? myCards[cardId] : null;
};

export const useCurrentBankCard = () => {
    const myCards = useCardsStore(state => state.myCards);
    const currentCardId = useCardsStore(state => state.selectedCardId);
    return myCards && currentCardId ? myCards[currentCardId] : null;
};

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getCardsStore = () => useCardsStore.getState();
}