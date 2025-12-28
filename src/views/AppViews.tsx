import AppLoader from '../AppLoader';
import UserFlow from '../components/UserFlow';
import { Routes as ROUTES } from '../routes';
import { EmailCodeView } from './Auth/EmailCode/EmailCodeView';
import { AuthLoginView } from './Auth/Login/AuthLoginView';
import { BonusTransferResultView } from './Friends/BonusTransferResultView';
import { BonusTransferView } from './Friends/BonusTransferView';
import { BonusView } from './Friends/BonusView';
import { CardController } from './Home/CardController';
import { HomeView } from './Home/HomeView';
import { IntroView } from './Intro/IntroView';
import { NewProductView } from './NewProduct/NewProductView';
import { CardPurchaseView } from './Payment/CardPurchase/CardPurchaseView';
import { CardPurchaseWaitingView } from './Payment/CardPurchaseWaiting/CardPurchaseWaitingView';
import { PaymentController } from './Payment/PaymentController';
import { PaymentRestore } from './Payment/PaymentRestore';
import { TopupView } from './Payment/Topup/TopupView';
import { TopupResultView } from './Payment/TopupResult/TopupResultView';
import { TopupWaitingView } from './Payment/TopupWaiting/TopupWaitingView';
import { TransferPlaceholderView } from './Placeholder/TransferPlaceholderView';
import { ProfileView } from './Profile/ProfileView';
import { SumsubView } from './Sumsub/SumsubView';
import { TelegramBackButton } from '@/components/common/TelegramBackButton';
import { DialogController } from '@/components/DialogController';
import { Navbar } from '@/components/Navbar/Navbar';
import { ToastsRoot } from '@/components/Toast/ToastsRoot';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* eslint-disable react/jsx-max-props-per-line */
const AppViews: React.FC = () => {
    return (
        <>
            <ToastsRoot />

            <Router>
                <TelegramBackButton />
                <DialogController />

                <Navbar />

                <AppLoader>
                    <UserFlow>
                        <PaymentRestore>
                            <CardController>
                                <Routes>
                                    <Route path={ROUTES.INTRO} element={<IntroView />} />

                                    <Route path={ROUTES.HOME} element={<HomeView />} />

                                    {/* Вход и подтверждение почты */}
                                    <Route path={ROUTES.AUTH_LOGIN} element={<AuthLoginView />} />
                                    <Route path={ROUTES.EMAIL_CONFIRMATION} element={<EmailCodeView />} />

                                    {/* SumSub KYC */}
                                    <Route path={ROUTES.SUMSUB_START} element={<SumsubView />} />

                                    {/* Витрина */}
                                    <Route path={ROUTES.NEW_PRODUCT} element={<NewProductView />} />

                                    <Route element={<PaymentController />}>
                                        {/* Покупка карты */}
                                        <Route path={ROUTES.CARD_PURCHASE} element={<CardPurchaseView />} />
                                        <Route path={ROUTES.CARD_PURCHASE_WAITING} element={<CardPurchaseWaitingView />} />

                                        {/* Пополнение */}
                                        <Route path={ROUTES.TOPUP} element={<TopupView />} />
                                        <Route path={ROUTES.TOPUP_WAITING} element={<TopupWaitingView />} />
                                        <Route path={ROUTES.TOPUP_RESULT} element={<TopupResultView />} />
                                    </Route>

                                    <Route path={ROUTES.USER_PROFILE} element={<ProfileView />} />

                                    <Route
                                        path={ROUTES.FRIENDS_BONUS}
                                        element={<BonusView />}
                                    />
                                    <Route
                                        path={ROUTES.TRANSFER_FROM_FRIENDS_BONUS}
                                        element={<BonusTransferView />}
                                    />
                                    <Route
                                        path={ROUTES.TRANSFER_FROM_FRIENDS_BONUS_RESULT}
                                        element={<BonusTransferResultView />}
                                    />

                                    <Route
                                        path='/payment/transfer'
                                        element={<TransferPlaceholderView />}
                                    />
                                </Routes>
                            </CardController>
                        </PaymentRestore>
                    </UserFlow>
                </AppLoader>
            </Router>
        </>
    );
};

export default AppViews;