import { ActionButton } from './components/ActionButton';
import { CardBalance } from './components/Balance/CardBalance';
import { CardBalanceFixed } from './components/Balance/CardBalanceFixed';
import { OrderCardBanner } from './components/Banners/OrderCardBanner';
import { CardActivation } from './components/CardActivation';
import { CardLimits } from './components/CardLimits';
import { LastTransactions } from './components/LastTransactions';
import { RefetchLoader } from './components/RefetchLoader';
import { CardsSlider } from '@/components/Bank/CardsSlider';
import { MainLayout } from '@/components/common/MainLayout';
import { CardDetails } from '@/components/Icons/CardDetailts';
import { Topup } from '@/components/Icons/Topup';
import { ConfettiAfterPurchase } from '@/components/Payment/ConfettiAfterPurchase';
import { UserHead } from '@/components/User/UserHead';
import { isCardActivationInProgress, isCardDisabled } from '@/states/cards/helpers';
import { CardStatus, useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './HomeView.module.scss';

const contentAppearance = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
};

export function HomeView() {
    const [t] = useTranslation();
    const myCards = useCardsStore(state => state.myCards);
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const currentCardId = useCardsStore(state => state.selectedCardId);
    const currentBankCard = myCards && currentCardId ? myCards[currentCardId] : null;
    const openCardDetails = useCardsStore(state => state.openCardDetails);

    let cardDisabled = false;
    let cardNeedActivation = false;
    let cardActivationPending = false;
    if (currentBankCard) {
        cardDisabled = isCardDisabled(currentBankCard.status);
        cardNeedActivation = currentBankCard.status === CardStatus.NeedActivation;
        cardActivationPending = isCardActivationInProgress(currentBankCard.status);
    }

    const handleTopupOpen = () => {
        if (currentCardId) {
            usePaymentStore.getState().openCurrencyModal('TOPUP');
            usePaymentStore.getState().startTopup(currentCardId);
        }
    };

    if (!myCardsCount) {
        return <Navigate
            to='/new-product'
            replace
        />;
    }

    return (
        <MainLayout fullSpace>
            <RefetchLoader />
            <ConfettiAfterPurchase />

            <UserHead>
                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    {currentBankCard && <motion.div
                        key={`${currentCardId}balanceFixed`}
                        {...contentAppearance}
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
                        {...contentAppearance}
                    >
                        <CardBalance
                            value={currentBankCard.balance}
                            currency={currentBankCard.currency}
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
                            cardActivationPending && styles.activation,
                            cardNeedActivation && styles.needActivation,
                            cardDisabled && styles.activationFailed
                        )}
                    >
                        {(cardActivationPending || cardNeedActivation || cardDisabled) && <CardActivation
                            cardId={currentBankCard.id}
                            status={currentBankCard.status}
                        />}

                        <div className={styles.main}>
                            <ActionButton
                                icon={<Topup />}
                                disabled={!currentBankCard.canDeposit && !(cardActivationPending || cardNeedActivation || cardDisabled)}
                                onClick={handleTopupOpen}
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