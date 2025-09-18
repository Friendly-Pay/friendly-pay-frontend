import { AppLoader } from './AppLoader';
import { BankTransferController } from './BankTransfer/BankTransferController';
import { BankTransferView } from './BankTransfer/views/BankTransferView';
import { CalculatorView } from './BankTransfer/views/CalculatorView';
import { CountrySelectView } from './BankTransfer/views/CountrySelectView';
import { DetailsView } from './BankTransfer/views/DetailsView';
import { HomeView } from './Home/HomeView';
import { IntroView } from './Intro/IntroView';
import { NewProductView } from './NewProduct/NewProductView';
import { BankTransferPaymentView } from './Payment/BankTransfer/BankTransferPaymentView';
import { BankTransferResultView } from './Payment/BankTransfer/BankTransferResultView';
import { BankTransferWaitingView } from './Payment/BankTransfer/BankTransferWaitingView';
import { PaymentController } from './Payment/PaymentController';
import { PaymentRestore } from './Payment/PaymentRestore';
import { PayNewCardResultView } from './Payment/PayNewCard/PayNewCardResultView';
import { PayNewCardView } from './Payment/PayNewCard/PayNewCardView';
import { PayNewCardWaitingView } from './Payment/PayNewCard/PayNewCardWaitingView';
import { TopupResultView } from './Payment/Topup/TopupResultView';
import { TopupView } from './Payment/Topup/TopupView';
import { TopupWaitingView } from './Payment/Topup/TopupWaitingView';
import { ProfileView } from './Profile/ProfileView';
import { VerificationErrorView } from './Verification/VerificarionErrorView';
import { VerificationView } from './Verification/VerificationView';
import { TelegramBackButton } from '@/components/common/TelegramBackButton';
import { DialogController } from '@/components/DialogController';
import { ToastsRoot } from '@/components/Toast/ToastsRoot';
import { useLoaderStore } from '@/states/loader';
import { CardController } from '@/views/Home/CardController';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export function AppViews() {
    const rootInitiated = useLoaderStore(state => state.rootInitiated);
    return (
        <>
            <AppLoader />
            <ToastsRoot />

            {rootInitiated && <Router>
                <TelegramBackButton />
                <DialogController />
                <PaymentRestore>
                    <CardController>
                        <Routes>
                            <Route
                                path='/'
                                element={<HomeView />}
                            />
                            <Route
                                path='/intro'
                                element={<IntroView />}
                            />
                            <Route
                                path='/new-product'
                                element={<NewProductView />}
                            />

                            <Route
                                path='/user/profile'
                                element={<ProfileView />}
                            />

                            <Route element={<PaymentController />}>
                                <Route
                                    path='/payments/pay-new-card'
                                    element={<PayNewCardView />}
                                />
                                <Route
                                    path='/payments/pay-new-card/waiting'
                                    element={<PayNewCardWaitingView />}
                                />
                                <Route
                                    path='/payments/pay-new-card/result'
                                    element={<PayNewCardResultView />}
                                />
                                <Route
                                    path='/payments/topup'
                                    element={<TopupView />}
                                />
                                <Route
                                    path='/payments/topup/waiting'
                                    element={<TopupWaitingView />}
                                />
                                <Route
                                    path='/payments/topup/result'
                                    element={<TopupResultView />}
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

                            <Route
                                path='/verification/user'
                                element={<VerificationView />}
                            />
                            <Route
                                path='/verification/user/error'
                                element={<VerificationErrorView />}
                            />

                            {/* Global Transfer */}
                            <Route element={<BankTransferController />}>
                                <Route
                                    path='/bank-transfer'
                                    element={<BankTransferView />}
                                />
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
            </Router>}
        </>
    );
}