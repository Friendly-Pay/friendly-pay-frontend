import { urlSearchParams } from '@/utils';
import { apiClient } from '@/utils/api';

export interface CardTypeResponse {
    id: number;
    name: string;
    description?: string;
    paymentSystem: 'Visa' | 'Mastercard';
    price: number;
    isVirtual: boolean;
    depositFee: number;
    depositTime: number; // секунды
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
    status: 'Active' | 'NeedActivation' | 'Activation' | 'Frozen';
    balance: number;
    currency: string;
    transactions: {
        id: number;
        type: 'deposit' | 'payment';
        status: 'success' | 'fail' | 'in-progress';
        amount: number;
        currency: string;
        originalAmount: number;
        originalCurrency: string;
        remark: string;
        createdAt: number; // unix timestamp
    }[];
}

export const fetchMyCards = async () => {
    // const res = await apiClient.get<UserCardResponse[]>('/card/user/list');
    // return res.data;
    return [
        {
            'id': 3,
            'typeId': 100008,
            'number': '2781',
            'canDeposit': true,
            'status': 'NeedActivation',
            'balance': 0,
            'currency': 'USD',
            'transactions': []
        }
    ];
    // return [
    //     {
    //         id: 101,
    //         typeId: 100005,
    //         number: '1111',
    //         canDeposit: true,
    //         // status: 'Active',
    //         status: 'Active',
    //         balance: 277.0,
    //         currency: 'usd',
    //         transactions: [
    //             {
    //                 type: 'payment',
    //                 status: 'success',
    //                 createdAt: '1744333204',
    //                 amount: 50,
    //                 currency: 'USD'
    //             },
    //             {
    //                 type: 'deposit',
    //                 status: 'success',
    //                 createdAt: '1744331204',
    //                 amount: 100,
    //                 currency: 'USD'
    //             }
    //         ]
    //     }
    // ] as UserCardResponse[];
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