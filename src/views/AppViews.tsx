import { AppLoader } from './AppLoader';
import { BonusTransferResultView } from './Friends/BonusTransferResultView';
import { BonusTransferView } from './Friends/BonusTransferView';
import { BonusView } from './Friends/BonusView';
import { HomeView } from './Home/HomeView';
import { IbanTransferView } from './Iban/IbanTransferView';
import { IbanView } from './Iban/IbanView';
import { IntroView } from './Intro/IntroView';
import { NewProductView } from './NewProduct/NewProductView';
import { PaymentController } from './Payment/PaymentController';
import { PaymentRestore } from './Payment/PaymentRestore';
import { PayNewCardResultView } from './Payment/PayNewCard/PayNewCardResultView';
import { PayNewCardView } from './Payment/PayNewCard/PayNewCardView';
import { PayNewCardWaitingView } from './Payment/PayNewCard/PayNewCardWaitingView';
import { TopupResultView } from './Payment/Topup/TopupResultView';
import { TopupView } from './Payment/Topup/TopupView';
import { TopupWaitingView } from './Payment/Topup/TopupWaitingView';
import { ProfileView } from './Profile/ProfileView';
import { SumsubIbanView } from './Sumsub/SumsubIbanView';
import { SumsubProcessingView } from './Sumsub/SumsubProcessingView';
import { SumsubStartView } from './Sumsub/SumsubStartView';
import { VerificationErrorView } from './Verification/VerificarionErrorView';
import { VerificationView } from './Verification/VerificationView';
import { PageLayout } from '@/components/common/PageLayout';
import { PageLayoutWithNavbar } from '@/components/common/PageLayoutWithNavbar';
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
                            <Route element={<PageLayoutWithNavbar />}>
                                <Route
                                    path='/'
                                    element={<HomeView />}
                                />
                                <Route
                                    path='/bank/account'
                                    element={<IbanView />}
                                />
                            </Route>

                            <Route element={<PageLayout />}>
                                <Route
                                    path='/bank/account/transfer'
                                    element={<IbanTransferView />}
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

                                <Route
                                    path='/sumsub/start'
                                    element={<SumsubStartView />}
                                />
                                <Route
                                    path='/sumsub/bank-account'
                                    element={<SumsubIbanView />}
                                />
                                <Route
                                    path='/sumsub/processing'
                                    element={<SumsubProcessingView />}
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
                                </Route>

                                <Route
                                    path='/verification/user'
                                    element={<VerificationView />}
                                />
                                <Route
                                    path='/verification/user/error'
                                    element={<VerificationErrorView />}
                                />

                                <Route
                                    path='/friends/bonus'
                                    element={<BonusView />}
                                />
                                <Route
                                    path='/friends/bonus/transfer'
                                    element={<BonusTransferView />}
                                />
                                <Route
                                    path='/friends/bonus/transfer/result'
                                    element={<BonusTransferResultView />}
                                />
                            </Route>
                        </Routes>
                    </CardController>
                </PaymentRestore>
            </Router>}
        </>
    );
}