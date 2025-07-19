import { HomeView } from './Home/HomeView';
import { IntroView } from './Intro/IntroView';
import { NewProductView } from './NewProduct/NewProductView';
import { PaymentController } from './Payment/PaymentController';
import { PayNewCardResultView } from './Payment/PayNewCard/PayNewCardResultView';
import { PayNewCardView } from './Payment/PayNewCard/PayNewCardView';
import { TopupResultView } from './Payment/Topup/TopupResultView';
import { TopupView } from './Payment/Topup/TopupView';
import { QRPlaceholderView } from './Placeholder/QrPlaceholderView';
import { TransferPlaceholderView } from './Placeholder/TransferPlaceholderView';
import { VerificationView } from './Verification/VerificationView';
import { TelegramBackButton } from '@/components/common/TelegramBackButton';
import { ToastsRoot } from '@/components/Toast/ToastsRoot';
import { useAuthStore } from '@/states/auth/store';
import { CardController } from '@/views/Home/CardController';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// @TODO blocked
// @TODO когда нет карт ведем на выбрать карту + позде будет еще отдельная страница
export function AppViews() {
    const isAuth = useAuthStore(state => state.isAuth);
    return (
        <>
            {isAuth && <Router>
                <TelegramBackButton>
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
                                path='/profile'
                                element={<IntroView />}
                            />

                            <Route element={<PaymentController />}>
                                <Route
                                    path='/payments/pay-new-card'
                                    element={<PayNewCardView />}
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
                                    path='/payments/topup/result'
                                    element={<TopupResultView />}
                                />
                            </Route>
                            <Route
                                path='/verification/user'
                                element={<VerificationView />}
                            />
                            <Route
                                path='/payment/transfer'
                                element={<TransferPlaceholderView />}
                            />
                            <Route
                                path='/payment/qr'
                                element={<QRPlaceholderView />}
                            />
                        </Routes>
                    </CardController>
                </TelegramBackButton>
            </Router>}

            <ToastsRoot />
        </>
    );
}