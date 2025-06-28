import { OrderCardBanner } from './components/Banners/OrderCardBanner';
import { WalletBanner } from './components/Banners/WalletBanner';
import { CardBalance } from './components/CardBalance';
import { CardBalanceFixed } from './components/CardBalanceFixed';
import { CardLimits } from './components/CardLimits';
import { LastTransactions } from './components/LastTransactions';
import { MainButton } from './components/MainButton';
import { CardsSlider } from '@/components/Bank/CardsSlider';
import { MainLayout } from '@/components/common/MainLayout';
import { Activate } from '@/components/Icons/Activate';
import { CardDetails } from '@/components/Icons/CardDetailts';
import { Topup } from '@/components/Icons/Topup';
import { FixedBottomLoading } from '@/components/Loading/FixedBottomLoading';
import { UserHead } from '@/components/User/UserHead';
import { CardStatus, useCardsStore } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { useVerificationStore } from '@/states/verification/store';
import { FetchStatus } from '@/utils/api';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
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
    exit: { opacity: 0, transition: { duration: 0.2 } },
    transition: { duration: 0.25 }
};


// @TODO skeleton
// @TODO number может null
export function HomeView() {
    const [t] = useTranslation();
    const myCards = useCardsStore(state => state.myCards);
    const currentCardId = useCardsStore(state => state.selectedCardId);
    const currentBankCard = myCards && currentCardId ? myCards[currentCardId] : null;
    const openTopup = useCardsStore(state => state.openTopupModal);
    const openCardDetails = useCardsStore(state => state.openCardDetails);

    // @TODO все действия с картами вынести в одно место типо CardActions
    const navigate = useNavigate();
    const [activationLoading, setActivationLoading] = useState(false);
    const startActivation = async () => {
        const verificationLevel = useUserStore.getState().user!.verificationLevel;
        if (verificationLevel === 'None') {
            useVerificationStore.getState().resetVerification();
            navigate('/verification/level/1');
            return;
        }

        if (activationLoading) return;
        setActivationLoading(true);
        await useCardsStore.getState().activateCard(currentCardId!);
        await useCardsStore.getState().loadMyCards();
        setActivationLoading(false);
    };

    const isActivation = currentBankCard && currentBankCard.status === CardStatus.Activation;
    const isNeedActivation = currentBankCard && currentBankCard.status === CardStatus.NeedActivation;

    const skipIntro = useUserStore(state => state.skipIntro);
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const myCardsFetchStatus = useCardsStore(state => state.myCardsFetchStatus);
    if (!skipIntro) {
        return <Navigate
            to='/intro'
            replace
        />;
    }
    if (!myCardsCount && myCardsFetchStatus === FetchStatus.Fulfilled) {
        return <Navigate
            to='/new-product'
            replace
        />;
    }

    return (
        <MainLayout fullSpace>
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
                            isNeedActivation && styles.needActivation
                        )}
                    >
                        <div className={styles.main}>
                            {isNeedActivation
                                ? <MainButton
                                    icon={<Activate />}
                                    loading={activationLoading}
                                    onClick={startActivation}
                                >
                                    {t('Activate')}
                                </MainButton>
                                : <>
                                    {/* TODO disabled !card.canDeposit */}
                                    <MainButton
                                        icon={<Topup />}
                                        disabled={!currentBankCard.canDeposit}
                                        onClick={openTopup}
                                    >
                                        {t('Top up')}
                                    </MainButton>

                                    <MainButton
                                        icon={<CardDetails />}
                                        onClick={openCardDetails}
                                    >
                                        {t('Details')}
                                    </MainButton>
                                </>}

                            {/* <MainButton icon={<More />}>
                                Еще
                            </MainButton> */}
                        </div>

                        <div className={styles.stack}>
                            <div className={styles.banners}>
                                <WalletBanner className={styles.banner} />
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

                <AnimatePresence>
                    {isActivation && <FixedBottomLoading text={t('Activation...')} />}
                </AnimatePresence>
            </div>}
        </MainLayout>
    );
}