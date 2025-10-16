import { CardBalance } from './components/Balance/CardBalance';
import { CardBalanceFixed } from './components/Balance/CardBalanceFixed';
import { OrderCardBanner } from './components/Banners/OrderCardBanner';
import { CardActivation } from './components/CardActivation';
import { CardLimits } from './components/CardLimits';
import { LastTransactions } from './components/LastTransactions';
import { RefetchLoader } from './components/RefetchLoader';
import { CardsSlider } from '@/components/Bank/CardsSlider';
import { ActionButton } from '@/components/Button/ActionButton';
import { MainLayout } from '@/components/common/MainLayout';
import { CardDetails } from '@/components/Icons/CardDetailts';
import { Topup } from '@/components/Icons/Topup';
import { UserHead } from '@/components/User/UserHead';
import { CardStatus, useCardsStore } from '@/states/cards/store';
import { PaymentActions } from '@/states/payment/actions';
import { useUserStore } from '@/states/user/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './HomeView.module.scss';

const balanceAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
};

const contentAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: { duration: 0.2 }
};

export function HomeView() {
    const [t] = useTranslation();
    const myCards = useCardsStore(state => state.myCards);
    const currentCardId = useCardsStore(state => state.selectedCardId);
    const currentBankCard = myCards && currentCardId ? myCards[currentCardId] : null;
    const openCardDetails = useCardsStore(state => state.openCardDetails);

    const isActivation = currentBankCard && (currentBankCard.status === CardStatus.ActivationProcessing || currentBankCard.status === CardStatus.VerificationProcessing);
    const isNeedActivation = currentBankCard && currentBankCard.status === CardStatus.NeedActivation;
    const isActivationFailed = currentBankCard && (currentBankCard.status === CardStatus.ActivationFailed || currentBankCard.status === CardStatus.VerificationFailed);

    const skipIntro = useUserStore(state => state.skipIntro);
    const myCardsCount = useCardsStore(state => state.myCardsCount);

    const navigate = useNavigate();
    const openTopup = () => {
        PaymentActions.topupCard(currentCardId!, navigate);
    };

    if (!skipIntro) {
        return <Navigate
            to='/intro'
            replace
        />;
    }
    if (!myCardsCount) {
        return <Navigate
            to='/new-product'
            replace
        />;
    }

    return (
        <MainLayout fullSpace>
            <RefetchLoader />

            <UserHead>
                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    {currentBankCard && <motion.div
                        key={`${currentCardId}balanceFixed`}
                        {...balanceAppearance}
                    >
                        <CardBalanceFixed
                            value={currentBankCard.balance}
                            currency={currentBankCard.currency}
                        />
                    </motion.div>}
                </AnimatePresence>
            </UserHead>

            {currentCardId && currentBankCard && <div className={styles.page}>
                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    <motion.div
                        key={`${currentCardId}balance`}
                        {...balanceAppearance}
                    >
                        <CardBalance
                            value={currentBankCard.balance}
                            currency={currentBankCard.currency}
                            cardName={currentBankCard.name}
                            cardStatus={currentBankCard.status}
                            className={styles.balance}
                        />
                    </motion.div>
                </AnimatePresence>

                <CardsSlider
                    myCards={myCards!}
                    currentCardId={currentCardId}
                />

                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    <motion.div
                        key={`${currentCardId}content`}
                        {...contentAppearance}
                        className={classNames(
                            styles.content,
                            isActivation && styles.activation,
                            isNeedActivation && styles.needActivation,
                            isActivationFailed && styles.activationFailed
                        )}
                    >
                        {(isActivation || isNeedActivation || isActivationFailed) && <CardActivation
                            cardId={currentBankCard.id}
                            status={currentBankCard.status}
                        />}

                        <div className={styles.main}>
                            <ActionButton
                                icon={<Topup />}
                                disabled={!currentBankCard.canDeposit && !(isActivation || isNeedActivation || isActivationFailed)}
                                onClick={openTopup}
                            >
                                {t('Top up')}
                            </ActionButton>

                            <ActionButton
                                icon={<CardDetails />}
                                onClick={openCardDetails}
                            >
                                {t('Details')}
                            </ActionButton>
                        </div>

                        <div className={styles.stack}>
                            <div className={styles.banners}>
                                {/* <WalletBanner
                                    hasGooglePay={currentBankCard.hasGooglePay}
                                    hasAppleWallet={currentBankCard.hasAppleWallet}
                                    className={styles.banner}
                                /> */}
                                <OrderCardBanner className={styles.banner} />
                            </div>

                            {currentBankCard.number && <>
                                <LastTransactions
                                    list={currentBankCard.transactions}
                                    lastFourDigits={currentBankCard.number}
                                    className={styles.transactions}
                                />
                                <CardLimits
                                    cardCurrency={currentBankCard.currency}
                                    cardLastFourDigits={currentBankCard.number}
                                    oneTimePaymentLimit={currentBankCard.limits.purchase.day}
                                />
                            </>}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>}
        </MainLayout>
    );
}