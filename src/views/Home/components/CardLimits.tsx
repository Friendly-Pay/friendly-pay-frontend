import { languageCodeToLocale } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCardLastFourDigits, formatCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './CardLimits.module.scss';

type CardLimitsProps = {
    cardCurrency: string
    cardLastFourDigits: string
    oneTimePaymentLimit: number
}

export function CardLimits({ cardLastFourDigits, cardCurrency, oneTimePaymentLimit }: CardLimitsProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);

    return (
        <div className={styles.root}>
            <Text
                type='title'
                align='left'
                weight='semibold'
                className={styles.title}
            >
                {t('Limits')}
            </Text>

            <Text
                type='body'
                weight='medium'
                align='left'
                className={styles.text}
                dangerouslySetInnerHTML={{
                    __html: t('One-time payment on Visa Premium card <span>{{cardLastFourDigits}}</span> is <span>{{oneTimePaymentLimit}}</span>', {
                        cardLastFourDigits: formatCardLastFourDigits(cardLastFourDigits),
                        oneTimePaymentLimit: formatCurrency(oneTimePaymentLimit, cardCurrency, languageCodeToLocale(languageCode), 0)
                    })
                }}
            >
            </Text>
        </div>
    );
}