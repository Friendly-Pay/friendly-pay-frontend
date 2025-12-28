import { Location } from 'react-router-dom';

export const Routes = {
    HOME: '/',
    ONBOARDING: '/onboarding',

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
} as const;

export const isUserOnAuthRoutes = (location: Location) => {
    const availableRoutes = ([Routes.AUTH_LOGIN, Routes.EMAIL_CONFIRMATION, Routes.ONBOARDING] as string[]);
    return availableRoutes.includes(location.pathname);
};
