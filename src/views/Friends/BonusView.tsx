import { BonusBalance } from './components/BonusBalance';
import { BonusLink } from './components/BonusLink';
import { CardBonus } from './components/CardBonus';
import { MainLayout } from '@/components/common/MainLayout';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useCardsStore } from '@/states/cards/store';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { Button, Text } from '@/uikit';
import { copyToClipboard } from '@/utils';
import { FetchStatus } from '@/utils/api';
import coinsImage from 'assets/bonus/coins.png?inline';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './BonusView.module.scss';

const cardsSortIds = [
    111018, // Gaming
    111021, // Basic,
    111028, // Premium
];

export function BonusView() {
    const [t] = useTranslation();
    const balance = useFriendsBonusesStore(state => state.balance);
    const balanceCurrency = useFriendsBonusesStore(state => state.balanceCurrency);

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

    const referralId = useFriendsBonusesStore(state => state.referralId);
    const referralLink = `https://t.me/arbi_wall_bot?start=r${referralId}`;

    const handleCopyLink = useCallback(async () => {
        const sanitized = String(referralLink).replace(/\s+/g, '');
        await copyToClipboard(sanitized);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        toast.success(t('Link copied'));
    }, [referralLink, t]);

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
            const loadFriends = useFriendsBonusesStore.getState().load;
            await loadFriends();
        };
        preload();
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <MainLayout>
            <div className={styles.wrap}>
                <div className={styles.promo}>
                    <img
                        src={coinsImage}
                        alt=''
                    />
                </div>

                <div className={styles.block}>
                    <div className={styles.balanceWrap}>
                        <div className={styles.balanceContent}>
                            <Text
                                type='caption'
                                align='left'
                                weight='medium'
                                className={styles.label}
                            >
                                {t('Credited')}
                            </Text>
                            <BonusBalance
                                value={balance || 0}
                                currency={balanceCurrency}
                                className={styles.balance}
                            />
                        </div>

                        <Button
                            view='primary'
                            className={styles.buttonTransfer}
                            onClick={handleTransfer}
                        >
                            {t('Withdraw')}
                        </Button>
                    </div>
                </div>

                <div className={styles.block}>
                    <div className={styles.linkWrap}>
                        <Text
                            type='title'
                            align='left'
                            weight='semibold'
                            className={styles.linkTitle}
                            dangerouslySetInnerHTML={{ __html: t('Invite friends<br /> and earn bonuses') }}
                        />

                        <Text
                            type='body'
                            align='left'
                            weight='regular'
                            className={styles.linkText}
                        >
                            {t('Share your referral link and earn up to $150 for card issuance and 0.5% of turnover')}
                        </Text>

                        {referralId && <BonusLink shareUrl={referralLink} />}
                    </div>
                </div>

                <div className={styles.terms}>
                    <Text
                        type='title'
                        align='center'
                        weight='semibold'
                        className={styles.termsTitle}
                    >
                        {t('Bonus terms')}
                    </Text>
                    <Text
                        type='body'
                        align='center'
                        weight='regular'
                        className={styles.termsText}
                    >
                        {t('By inviting partners, you receive bonuses from card issuance and from the partner’s top-ups for 12 months')}
                    </Text>
                </div>

                <div className={styles.block}>
                    <div className={styles.cardsList}>
                        {availableCards.map(card => <CardBonus
                            key={card.id}
                            cardName={card.name}
                            cardTypeId={card.id}
                            cardPaymentSystem={card.paymentSystem}
                            depositBonus={card.referralDepositPercent}
                            bonusAmount={card.referralAmount}
                            bonusCurrency={balanceCurrency}
                        />)}
                    </div>
                </div>
            </div>

            <TelegramMainButton
                text={t('Copy link')}
                onClick={handleCopyLink}
            />
        </MainLayout>
    );
}