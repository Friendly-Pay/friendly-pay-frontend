import { OfferCard } from './OfferCard';
import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import basicCard from 'assets/bonus/basic_card.png';
import gamingCard from 'assets/bonus/gaming_card.png';
import premiumCard from 'assets/bonus/premium_card.png';
import { useTranslation } from 'react-i18next';
import styles from './PurchaseOffer.module.scss';

type PurchaseOfferProps = {
    cardTypeId: number
    cardName: string
    bonusAmount: number
    bonusCurrency: string
    width?: number | string
    className?: string
    onClick?: () => void
}

export const OFFERS_CONFIG = {
    111018: {
        image: gamingCard,
        color: 'var(--color-white)',
        backgroundColor: '#131315',
    },
    111021: {
        image: basicCard,
        color: 'var(--color-white)',
        backgroundColor: '#131315',
    },
    111028: {
        image: premiumCard,
        color: 'var(--color-white)',
        backgroundColor: '#131315',
    }
};

export function PurchaseOffer({ cardTypeId, cardName, bonusAmount, bonusCurrency, width, className, onClick }: PurchaseOfferProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);

    const offerConfig = OFFERS_CONFIG[cardTypeId as keyof typeof OFFERS_CONFIG];
    const color = offerConfig.color;
    const image = offerConfig.image;
    const backgroundColor = offerConfig.backgroundColor;
    const backgroundImage = 'backgroundImage' in offerConfig ? `url(${offerConfig.backgroundImage})` : undefined;

    if (!offerConfig) {
        return null;
    }

    return (
        <OfferCard
            className={className}
            style={{ width, backgroundImage, backgroundColor }}
            onClick={onClick}
        >
            <div
                className={styles.image}
                style={{ backgroundImage: `url(${image})` }}
            ></div>

            <div className={styles.content}>
                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                    style={{ color }}
                    className={styles.title}
                >
                    {t('Card')} {cardName}
                </Text>

                <div className={styles.reward}>
                    <Text
                        align='left'
                        weight='regular'
                        style={{ color }}
                        className={styles.label}
                    >
                        {t('You')}
                    </Text>

                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                        style={{ color }}
                        className={styles.bonus}
                    >
                        {formatCurrency(bonusAmount, bonusCurrency, locale, 0)} {t('to balance')}
                    </Text>
                </div>
            </div>
        </OfferCard>
    );
}