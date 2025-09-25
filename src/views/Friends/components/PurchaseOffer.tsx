import { OfferCard } from './OfferCard';
import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import basicCard from 'assets/bonus/basic_card.png';
import gamingCard from 'assets/bonus/gaming_card.png';
import premiumCardBackground from 'assets/bonus/premium_background.png';
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
        color: '#FFF',
        backgroundColor: '#1B2737',
    },
    111021: {
        image: basicCard,
        color: 'var(--color-white)',
        backgroundColor: '#175AEA',
    },
    111028: {
        image: premiumCard,
        border: '2px solid var(--color-primary)',
        color: 'var(--color-typo-primary)',
        backgroundColor: 'var(--color-white)',
        backgroundImage: premiumCardBackground
    }
};

export function PurchaseOffer({ cardTypeId, cardName, bonusAmount, bonusCurrency, width, className, onClick }: PurchaseOfferProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);

    const offerConfig = OFFERS_CONFIG[cardTypeId as keyof typeof OFFERS_CONFIG];
    const color = offerConfig.color;
    const image = offerConfig.image;
    const border = 'border' in offerConfig ? offerConfig.border : undefined;
    const backgroundColor = offerConfig.backgroundColor;
    const backgroundImage = 'backgroundImage' in offerConfig ? `url(${offerConfig.backgroundImage})` : undefined;

    if (!offerConfig) {
        return null;
    }

    return (
        <OfferCard
            className={className}
            style={{ width, backgroundImage, border, backgroundColor }}
            onClick={onClick}
        >
            <img
                src={image}
                alt=''
                className={styles.image}
            />

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
                        Вам
                    </Text>

                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                        style={{ color }}
                        className={styles.bonus}
                    >
                        {formatCurrency(bonusAmount, bonusCurrency, locale, 0)} на баланс
                    </Text>
                </div>
            </div>
        </OfferCard>
    );
}