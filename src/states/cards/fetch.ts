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
    //         'id': 81,
    //         'typeId': 111028,
    //         'number': '3616',
    //         'canDeposit': true,
    //         'status': CardStatus.NeedActivation,
    //         'balance': 65.15,
    //         'currency': 'USD',
    //         'createdAt': 1752825741,
    //         'customExpireAt': null,
    //         'transactions': [
    //             {
    //                 'id': 6066,
    //                 'type': 'payment',
    //                 'status': 'success',
    //                 'amount': 38.02,
    //                 'currency': 'USD',
    //                 'originalAmount': 1210,
    //                 'originalCurrency': 'THB',
    //                 'remark': 'THE BEACH BAR PHUKET THA',
    //                 'fee': 0.3,
    //                 'merchantName': 'The Beach Bar',
    //                 'merchantLogo': null,
    //                 'createdAt': 1764155928
    //             },
    //             {
    //                 'id': 6063,
    //                 'type': 'deposit',
    //                 'status': 'success',
    //                 'amount': 96,
    //                 'currency': 'USD',
    //                 'originalAmount': 96,
    //                 'originalCurrency': 'USD',
    //                 'remark': 'Deposit',
    //                 'fee': 4,
    //                 'merchantName': null,
    //                 'merchantLogo': null,
    //                 'createdAt': 1764155494
    //             },
    //             {
    //                 'id': 6061,
    //                 'type': 'payment',
    //                 'status': 'success',
    //                 'amount': 9.99,
    //                 'currency': 'USD',
    //                 'originalAmount': 9.99,
    //                 'originalCurrency': 'USD',
    //                 'remark': 'Mobimatter Abu Dhabi ARE',
    //                 'fee': 0.3,
    //                 'merchantName': 'Mobimatter',
    //                 'merchantLogo': 'https://brand-cdn.friendlypay.me/general/mobimatter.jpg',
    //                 'createdAt': 1764154484
    //             },
    //             {
    //                 'id': 6011,
    //                 'type': 'payment',
    //                 'status': 'success',
    //                 'amount': 6.75,
    //                 'currency': 'USD',
    //                 'originalAmount': 216,
    //                 'originalCurrency': 'THB',
    //                 'remark': '7-11 LAGUNA PHUKET CHOENGTHALE T THA',
    //                 'fee': 0.3,
    //                 'merchantName': '7-11',
    //                 'merchantLogo': 'https://brand-cdn.friendlypay.me/general/7-11.jpg',
    //                 'createdAt': 1764071469
    //             },
    //             {
    //                 'id': 5921,
    //                 'type': 'payment',
    //                 'status': 'success',
    //                 'amount': 32.35,
    //                 'currency': 'USD',
    //                 'originalAmount': 1034,
    //                 'originalCurrency': 'THB',
    //                 'remark': 'PANAMA MARKET-CHOENGTA PHUKET THA',
    //                 'fee': 0.3,
    //                 'merchantName': 'Panama Market',
    //                 'merchantLogo': null,
    //                 'createdAt': 1763966133
    //             },
    //             {
    //                 'id': 5920,
    //                 'type': 'deposit',
    //                 'status': 'success',
    //                 'amount': 28.8,
    //                 'currency': 'USD',
    //                 'originalAmount': 28.8,
    //                 'originalCurrency': 'USD',
    //                 'remark': 'Deposit',
    //                 'fee': 1.2,
    //                 'merchantName': null,
    //                 'merchantLogo': null,
    //                 'createdAt': 1763966094
    //             },
    //             {
    //                 'id': 5919,
    //                 'type': 'payment',
    //                 'status': 'failed',
    //                 'amount': 32.35,
    //                 'currency': 'USD',
    //                 'originalAmount': 1034,
    //                 'originalCurrency': 'THB',
    //                 'remark': 'PANAMA MARKET-CHOENGTA PHUKET THA',
    //                 'fee': 0,
    //                 'merchantName': 'Panama Market',
    //                 'merchantLogo': null,
    //                 'createdAt': 1763965960
    //             },
    //             {
    //                 'id': 5918,
    //                 'type': 'deposit',
    //                 'status': 'success',
    //                 'amount': 26.52,
    //                 'currency': 'USD',
    //                 'originalAmount': 26.52,
    //                 'originalCurrency': 'USD',
    //                 'remark': 'Deposit',
    //                 'fee': 1.1,
    //                 'merchantName': null,
    //                 'merchantLogo': null,
    //                 'createdAt': 1763965882
    //             },
    //             {
    //                 'id': 5903,
    //                 'type': 'payment',
    //                 'status': 'success',
    //                 'amount': 65.67,
    //                 'currency': 'USD',
    //                 'originalAmount': 2098.69,
    //                 'originalCurrency': 'THB',
    //                 'remark': 'TOPS-PORTO DE PHUKET PHUKET THA',
    //                 'fee': 0.3,
    //                 'merchantName': 'Tops-Porto',
    //                 'merchantLogo': null,
    //                 'createdAt': 1763912409
    //             },
    //             {
    //                 'id': 5902,
    //                 'type': 'deposit',
    //                 'status': 'success',
    //                 'amount': 24,
    //                 'currency': 'USD',
    //                 'originalAmount': 24,
    //                 'originalCurrency': 'USD',
    //                 'remark': 'Deposit',
    //                 'fee': 1,
    //                 'merchantName': null,
    //                 'merchantLogo': null,
    //                 'createdAt': 1763912367
    //             }
    //         ]
    //     },
    //     {
    //         'id': 82,
    //         'typeId': 111035,
    //         'number': '3800',
    //         'canDeposit': true,
    //         'status': CardStatus.Active,
    //         'balance': 100000.15,
    //         'currency': 'USD',
    //         'createdAt': 1752825741,
    //         'customExpireAt': null,
    //         transactions: [],
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