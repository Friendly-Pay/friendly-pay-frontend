// import { CardStatus } from './store';
import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';

export interface CardTypeResponse {
    id: number;
    name: string;
    description?: string;
    paymentSystem: 'Visa' | 'Mastercard';
    price: number;
    isVirtual: boolean;
    minDeposit: number;
    depositFee: number;
    depositTime: number; // секунды
    referralAmount: number;
    referralDepositPercent: number;
    hasGooglePay: boolean;
    hasAppleWallet: boolean;
    canWithdrawalAtm: boolean;
    cashback?: number;
    expireDays: number;
    available: boolean;
    limits: {
        purchase: { day: number; transaction: number };
        atm: { day: number; transaction: number } | null;
        deposit: { day: number; transaction: number };
    };
}

export const fetchCardTypes = async () => {
    const res = await apiClient.get<CardTypeResponse[]>('/card/type/list');
    return res.data;
    // return [
    //     {
    //         'id': 3,
    //         'name': 'Platinum',
    //         'paymentSystem': 'Visa',
    //         'depositFee': 2,
    //         'depositTime': 43200,
    //         'available': true,
    //         'price': 1,
    //         'isVirtual': true,
    //         'canWithdrawalAtm': false,
    //         'limits': {
    //             'purchase': {
    //                 'day': 10000,
    //                 'transaction': 10000
    //             },
    //             'atm': {
    //                 'day': 10000,
    //                 'transaction': 10000
    //             },
    //             'deposit': {
    //                 'day': 10000,
    //                 'transaction': 10000
    //             }
    //         }
    //     }
    // ] as CardTypeResponse[];
};

export interface UserCardResponse {
    id: number;
    typeId: number;
    number: string | null;
    canDeposit: boolean;
    status: 'Active' | 'NeedActivation' | 'VerificationProcessing' | 'ActivationProcessing' | 'VerificationFailed' | 'ActivationFailed' | 'Frozen';
    balance: number;
    currency: string;
    createdAt: number;
    customExpireAt: number;
    transactions: {
        id: number;
        type: 'deposit' | 'payment' | 'refund' | 'void';
        status: 'success' | 'failed' | 'in-progress';
        amount: number;
        currency: string;
        originalAmount: number;
        originalCurrency: string;
        fee: number;
        remark: string;
        createdAt: number; // unix timestamp
    }[];
}

export const fetchMyCards = async () => {
    const res = await apiClient.get<UserCardResponse[]>('/card/user/list');
    return res.data;
    // return [
    //     {
    //         'id': 3,
    //         'typeId': 100010,
    //         'number': '2781',
    //         // 'number': null,
    //         'canDeposit': true,
    //         'status': 'NeedActivation',
    //         // 'status': 'VerificationProcessing',
    //         // 'status': 'ActivationProcessing',
    //         // 'status': 'VerificationFailed',
    //         // 'status': 'Active',
    //         'balance': 0,
    //         'currency': 'USD',
    //         'transactions': []
    //     }
    // ];
    // return [
    //     {
    //         id: 101,
    //         typeId: 100005,
    //         number: '1111',
    //         canDeposit: true,
    //         status: 'Activation',
    //         balance: 277.0,
    //         currency: 'usd',
    //         transactions: []
    //     }
    // ];
};

export interface CardDetailsResponse {
    number: string;
    cvv: number;
    expireAt: number; // Unix timestamp
}

export const fetchCardDetails = async (cardId: number) => {
    const searchParams = urlSearchParams({ cardId });
    const res = await apiClient.get<CardDetailsResponse>(`/card/details?${searchParams}`);
    return res.data;
    // return {
    //     number: '4111 1111 1111 1111',
    //     cvv: 123,
    //     expireAt: 1704067200,
    // };
};

export const activateCard = async (cardId: number) => {
    await apiClient.post('/card/activate', { cardId });
};