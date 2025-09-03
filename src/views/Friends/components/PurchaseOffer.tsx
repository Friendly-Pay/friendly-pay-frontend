import { OfferCard } from './OfferCard';
import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import virtual1 from 'assets/bonus/virtual_1.png?inline';
import virtual2 from 'assets/bonus/virtual_2.png?inline';
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
    111033: {
        image: virtual1,
        color: 'var(--color-white)',
        backgroundColor: '#04070B',
        border: '2px solid rgba(255,255,255,0.2)',
    },
    111028: {
        image: virtual2,
        color: '#19212C',
        backgroundColor: 'var(--color-white)',
    }
};

export function PurchaseOffer({ cardTypeId, cardName, bonusAmount, bonusCurrency, width, className, onClick }: PurchaseOfferProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);

    const offerConfig = OFFERS_CONFIG[cardTypeId as keyof typeof OFFERS_CONFIG];
    if (!offerConfig) {
        return null;
    }
    const color = offerConfig.color;
    const image = offerConfig.image;
    const border = 'border' in offerConfig ? offerConfig.border : undefined;
    const backgroundColor = offerConfig.backgroundColor;
    const backgroundImage = 'backgroundImage' in offerConfig ? `url(${offerConfig.backgroundImage})` : undefined;

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
                        {t('To you')}
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