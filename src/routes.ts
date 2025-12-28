import { Location } from 'react-router-dom';

export const Routes = {
    HOME: '/',

    // Auth
    AUTH_LOGIN: '/auth/login',
    EMAIL_CONFIRMATION: '/auth/code',

    SUMSUB_START: '/sumsub/start',

    NEW_PRODUCT: '/new-product',

    CARD_PURCHASE: '/payments/pay-new-card',
    CARD_PURCHASE_WAITING: '/payments/pay-new-card/waiting',

    TOPUP: '/payments/topup',
    TOPUP_WAITING: '/payments/topup/waiting',
    TOPUP_RESULT: '/payments/topup/result',

    USER_PROFILE: '/user/profile',

    IBAN_ACCOUNT: '/bank/account',
    TRANSFER_FROM_IBAN_ACCOUNT: '/bank/account/transfer',

    FRIENDS_BONUS: '/friends/bonus',
    TRANSFER_FROM_FRIENDS_BONUS: '/friends/bonus/transfer',
    TRANSFER_FROM_FRIENDS_BONUS_RESULT: '/friends/bonus/transfer/result',


} as const;

export const isUserOnAuthRoutes = (location: Location) => {
    const availableRoutes = ([Routes.AUTH_LOGIN, Routes.EMAIL_CONFIRMATION] as string[]);
    return availableRoutes.includes(location.pathname);
};
