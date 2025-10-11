import { BonusBalance } from './components/BonusBalance';
import { BANNER_IMAGE, DepositOffer } from './components/DepositOffer';
import { OffersSlider } from './components/OffersSlider';
import { OFFERS_CONFIG, PurchaseOffer } from './components/PurchaseOffer';
import { MainLayout } from '@/components/common/MainLayout';
import { safeLanguageCode } from '@/localization/utils';
import { useCardsStore } from '@/states/cards/store';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { useUserStore } from '@/states/user/store';
import { Button, Text } from '@/uikit';
import { copyToClipboard, formatCurrency } from '@/utils';
import { FetchStatus } from '@/utils/api';
import { loadDomImage } from '@/utils/preload';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './BonusView.module.scss';

const cardsSortIds = [
    111018, // Gaming
    111021, // Basic
    111028, // Premium
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
    const transferMinAmount = useFriendsBonusesStore(state => state.transferMinAmount);

    const navigate = useNavigate();
    const handleTransfer = () => {
        const cardId = useCardsStore.getState().myCardsIds?.[0];
        if (cardId) {
            useFriendsBonusesStore.getState().setTransferCardId(cardId);
            navigate('/friends/bonus/transfer');
        }
    };

    const referralId = useFriendsBonusesStore(state => state.referralId);
    const referralLink = `https://t.me/axt_community_bot?start=r${referralId}`;

    const handleCopyLink = useCallback(async () => {
        const sanitized = String(referralLink).replace(/\s+/g, '');
        await copyToClipboard(sanitized);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        toast.success(t('Link copied'));
    }, [referralLink, t]);

    const fetchStatus = useFriendsBonusesStore(state => state.fetchStatus);
    const isLoading = balance === null && fetchStatus !== FetchStatus.Fulfilled;

    const triggered = useRef<boolean>(false);
    useEffect(() => {
        if (triggered.current) return;
        triggered.current = true;
        const preload = async () => {
            const assets = [BANNER_IMAGE];
            for (const config of Object.values(OFFERS_CONFIG)) {
                if (config.image) {
                    assets.push(config.image);
                }
                // if ('backgroundImage' in config && config.backgroundImage) {
                //     assets.push(config.backgroundImage);
                // }
            }
            const loadFriends = useFriendsBonusesStore.getState().load;
            await loadFriends();
            await Promise.all(
                assets
                    .filter(Boolean)
                    .map(asset => loadDomImage(asset))
            );
        };
        preload();
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <MainLayout className={styles.layout}>
            <div className={styles.head}>
                <Text
                    type='caption'
                    align='left'
                    weight='medium'
                >
                    {t('You have earned')}
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
                    {t('Minimum amount to transfer to the card {{amount}}', { amount: formatCurrency(transferMinAmount!, balanceCurrency, locale, 0) })}
                </Text>
            </div>

            <div className={styles.block}>
                <Button
                    view='primary'
                    onClick={handleCopyLink}
                >
                    {t('Copy link')}
                </Button>
            </div>

            <div className={styles.block}>
                <Text
                    type='bodyLarge'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Recommend the virtual card')}
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

            {/* {transactions?.length && <div className={styles.block}>
                <Text
                    type='bodyLarge'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    Последние рекомендации
                </Text>
            </div>} */}

            {/* <TelegramMainButton
                visible
                text='Советовать'
                onClick={handleShare}
            /> */}
        </MainLayout>
    );
}