import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { safeLanguageCode } from '@/localization/utils';
import { PaymentSystem } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Line, Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './CardBonus.module.scss';

type CardBonusProps = {
    cardTypeId: number
    cardName: string
    cardPaymentSystem: PaymentSystem,
    bonusAmount: number
    bonusCurrency: string
    depositBonus: number
}

export function CardBonus({ cardTypeId, cardName, cardPaymentSystem, bonusAmount, bonusCurrency, depositBonus }: CardBonusProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);
    return (
        <div className={styles.root}>
            <div className={styles.content}>
                <div className={styles.head}>
                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                        className={styles.name}
                    >
                        {cardName}
                    </Text>

                    <div className={styles.preview}>
                        <BankCardPreview
                            typeId={cardTypeId}
                            paymentSystem={cardPaymentSystem}
                            className={styles.cardPreview}
                        />
                    </div>
                </div>

                <div className={styles.data}>
                    <Text
                        type='body'
                        align='left'
                        weight='medium'
                        className={styles.label}
                    >
                        {t('Issuance')}
                    </Text>
                    <Text
                        type='body'
                        align='right'
                        weight='medium'
                        className={styles.value}
                    >
                        {formatCurrency(bonusAmount, bonusCurrency, locale)}
                    </Text>
                </div>
                <Line />
                <div className={styles.data}>
                    <Text
                        type='body'
                        align='left'
                        weight='medium'
                        className={styles.label}
                    >
                        {t('% of turnover')}
                    </Text>
                    <Text
                        type='body'
                        align='right'
                        weight='medium'
                        className={styles.value}
                    >
                        {depositBonus}%
                    </Text>
                </div>
            </div>
        </div>
    );
}