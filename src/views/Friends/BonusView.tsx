import { BonusBalance } from './components/BonusBalance';
import { DepositOffer } from './components/DepositOffer';
import { OffersSlider } from './components/OffersSlider';
import { PurchaseOffer } from './components/PurchaseOffer';
import { ShareButton } from './components/ShareButton';
import { MainLayout } from '@/components/common/MainLayout';
import { safeLanguageCode } from '@/localization/utils';
import { useCardsStore } from '@/states/cards/store';
import { ACCESS_TO_FRIENDS_BONUS } from '@/states/friends/access';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { useUserStore } from '@/states/user/store';
import { Button, Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { FetchStatus } from '@/utils/api';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './BonusView.module.scss';

const cardsSortIds = [
    111033,
    111028,
];

export function BonusView() {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);

    const cardsTypes = useCardsStore(state => state.cardsTypes);
    const availableCards = useMemo(() => {
        if (!cardsTypes) return [];
        const list = Object.values(cardsTypes).filter(card => card.available);
        if (!cardsSortIds?.length) return list;
        const pos = new Map<string, number>(cardsSortIds.map((id, i) => [String(id), i]));
        return list.sort((a, b) => {
            const ai = pos.get(String(a.id)) ?? Number.POSITIVE_INFINITY;
            const bi = pos.get(String(b.id)) ?? Number.POSITIVE_INFINITY;
            if (ai !== bi) return ai - bi;
            return 0;
        });
    }, [cardsTypes]);

    const bonusDeposit = availableCards[0].referralDepositPercent || 1;

    const balance = useFriendsBonusesStore(state => state.balance);
    const balanceCurrency = useFriendsBonusesStore(state => state.balanceCurrency);
    // const transactions = useFriendsBonusesStore(state => state.transactions);
    const transferMinAmount = useFriendsBonusesStore(state => state.transferMinAmount);

    const navigate = useNavigate();
    const handleTransfer = () => {
        const cardId = useCardsStore.getState().myCardsIds?.[0];
        if (cardId) {
            useFriendsBonusesStore.getState().setTransferCardId(cardId);
            navigate('/friends/bonus/transfer');
        }
    };

    const fetchStatus = useFriendsBonusesStore(state => state.fetchStatus);
    const isLoading = balance === null && fetchStatus !== FetchStatus.Fulfilled;

    const triggered = useRef<boolean>(false);
    useEffect(() => {
        if (triggered.current) return;
        triggered.current = true;
        const preload = async () => {
            // const assets = [BANNER_IMAGE];
            // for (const config of Object.values(OFFERS_CONFIG)) {
            //     if (config.image) {
            //         assets.push(config.image);
            //     }
            //     if ('backgroundImage' in config && config.backgroundImage) {
            //         assets.push(config.backgroundImage);
            //     }
            // }
            const loadFriends = useFriendsBonusesStore.getState().load;
            await loadFriends();
            // await Promise.all(
            //     assets
            //         .filter(Boolean)
            //         .map(asset => loadDomImage(asset))
            // );
        };
        preload();
    }, []);

    const userId = useUserStore(state => state.user!.id);
    const hasAccessToFriendsBonus = ACCESS_TO_FRIENDS_BONUS.includes(userId) || import.meta.env.DEV;
    if (!hasAccessToFriendsBonus) {
        return (<Navigate
            to='/'
            replace
        />);
    }

    if (isLoading) {
        return null;
    }

    return (
        <MainLayout>
            <div className={styles.head}>
                <Text
                    type='caption'
                    align='left'
                    weight='medium'
                >
                    {t('You earned')}
                </Text>

                <div className={styles.headBalance}>
                    <BonusBalance
                        value={balance!}
                        currency={balanceCurrency}
                    />
                    <Button
                        view='primary'
                        smallSize
                        className={styles.transfer}
                        onClick={handleTransfer}
                    >
                        {t('Transfer')}
                    </Button>
                </div>

                <Text
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('The minimum amount for transfer to the card is {{value}}', { value: formatCurrency(transferMinAmount!, balanceCurrency, locale, 0) })}
                </Text>
            </div>
            <div className={styles.block}>
                <Text
                    type='bodyLarge'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Recommend a virtual card')}
                </Text>
                <OffersSlider>
                    {availableCards.map(card => <PurchaseOffer
                        key={card.id}
                        cardTypeId={card.id}
                        cardName={card.name}
                        bonusAmount={card.referralAmount}
                        bonusCurrency={balanceCurrency}
                        width={283}
                        className={styles.scrollableItem}
                    />)}
                </OffersSlider>
            </div>

            {bonusDeposit && <div className={styles.block}>
                <Text
                    type='bodyLarge'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Bonus for an active friend')}
                </Text>
                <DepositOffer depositBonusPercent={bonusDeposit} />
            </div>}

            {/* 
            {transactions?.length && <div className={styles.block}>
                <Text
                    type='bodyLarge'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    Последние рекомендации
                </Text>
            </div>} */}

            <div className={styles.fakeFooter}></div>

            <ShareButton />
        </MainLayout>
    );
}