import AppLoader from '../AppLoader';
import UserFlow from '../components/UserFlow';
import { Routes as ROUTES } from '../routes';
import { EmailCodeView } from './Auth/EmailCode/EmailCodeView';
import { AuthLoginView } from './Auth/Login/AuthLoginView';
import { BankTransferController } from './BankTransfer/BankTransferController';
import { BankTransferView } from './BankTransfer/views/BankTransferView';
import { CalculatorView } from './BankTransfer/views/CalculatorView';
import { CountrySelectView } from './BankTransfer/views/CountrySelectView';
import { DetailsView } from './BankTransfer/views/DetailsView';
import { BonusTransferView } from './Friends/BonusTransferView';
import { BonusView } from './Friends/BonusView';
import { CardController } from './Home/CardController';
import { HomeView } from './Home/HomeView';
import { IbanTransferView } from './Iban/IbanTransferView';
import { IbanView } from './Iban/IbanView';
import { NewProductView } from './NewProduct/NewProductView';
import { BankTransferPaymentView } from './Payment/BankTransfer/BankTransferPaymentView';
import { BankTransferResultView } from './Payment/BankTransfer/BankTransferResultView';
import { BankTransferWaitingView } from './Payment/BankTransfer/BankTransferWaitingView';
import { CardPurchaseView } from './Payment/CardPurchase/CardPurchaseView';
import { CardPurchaseWaitingView } from './Payment/CardPurchaseWaiting/CardPurchaseWaitingView';
import { PaymentController } from './Payment/PaymentController';
import { PaymentRestore } from './Payment/PaymentRestore';
import { TopupView } from './Payment/Topup/TopupView';
import { TopupResultView } from './Payment/TopupResult/TopupResultView';
import { TopupWaitingView } from './Payment/TopupWaiting/TopupWaitingView';
import { ProfileView } from './Profile/ProfileView';
import { SumsubView } from './Sumsub/SumsubView';
import { PageLayout } from '@/components/common/PageLayout';
import { PageLayoutWithNavbar } from '@/components/common/PageLayoutWithNavbar';
import { TelegramBackButton } from '@/components/common/TelegramBackButton';
import { DialogController } from '@/components/DialogController';
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


                <AppLoader>
                    <UserFlow>
                        <PaymentRestore>
                            <CardController>
                                <Routes>
                                    <Route element={<PageLayoutWithNavbar />}>
                                        <Route path={ROUTES.HOME} element={<HomeView />} />
                                        <Route path={ROUTES.IBAN_ACCOUNT} element={<IbanView />} />

                                        <Route
                                            path='/friends/bonus'
                                            element={<BonusView />}
                                        />

                                        <Route element={<BankTransferController />}>
                                            <Route
                                                path='/bank-transfer'
                                                element={<BankTransferView />}
                                            />
                                        </Route>
                                    </Route>

                                    <Route element={<PageLayout />}>
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

                                            <Route
                                                path='/friends/bonus/transfer'
                                                element={<BonusTransferView />}
                                            />

                                            {/* Global Transfer */}
                                            <Route
                                                path='/payments/bank-transfer'
                                                element={<BankTransferPaymentView />}
                                            />
                                            <Route
                                                path='/payments/bank-transfer/waiting'
                                                element={<BankTransferWaitingView />}
                                            />
                                            <Route
                                                path='/payments/bank-transfer/result'
                                                element={<BankTransferResultView />}
                                            />
                                        </Route>

                                        <Route path={ROUTES.USER_PROFILE} element={<ProfileView />} />

                                        {/* Перевод по IBAN */}
                                        <Route path={ROUTES.TRANSFER_FROM_IBAN_ACCOUNT} element={<IbanTransferView />} />
                                    </Route>

                                    <Route element={<BankTransferController />}>
                                        <Route
                                            path='/bank-transfer/country'
                                            element={<CountrySelectView />}
                                        />
                                        <Route
                                            path='/bank-transfer/calculate'
                                            element={<CalculatorView />}
                                        />
                                        <Route
                                            path='/bank-transfer/details'
                                            element={<DetailsView />}
                                        />
                                    </Route>
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