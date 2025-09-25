import { ClockFill } from '../Icons/Clock';
import { TopupBold } from '../Icons/Topup';
import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { CenteredContent } from '@/views/Payment/components/CenteredContent';
import { PaymentIcon } from '@/views/Payment/components/PaymentIcon';
import { useTranslation } from 'react-i18next';
import styles from './TopupResult.module.scss';

type TopupResultProps = {
    isPending?: boolean
    cardNumber?: string | null
    topupAmount: number
    topupCurrency: string
}

export function TopupResult({ isPending, cardNumber, topupAmount, topupCurrency }: TopupResultProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(topupAmount, topupCurrency, safeLanguageCode(languageCode));

    return (
        <CenteredContent className={styles.content}>
            {cardNumber && <Text
                type='caption'
                align='center'
                weight='medium'
                className={styles.bankAccount}
            >
                {t('Account')} <span>{formatCardLastFourDigits(cardNumber)}</span>
            </Text>}

            <PaymentIcon className={styles.icon}>
                <TopupBold />
            </PaymentIcon>

            <Text
                type='headlineLarge'
                align='center'
                weight='semibold'
                className={styles.amount}
            >
                +{formattedCurrencyParts.map((part, index) => (
                    <span
                        key={index}
                        className={styles[part.type]}
                    >
                        {part.value}
                    </span>
                ))}
            </Text>

            {isPending && <Text
                weight='regular'
                className={styles.status}
            >
                <ClockFill />
                <div>{t('Top-up in progress')}</div>
            </Text>}

            <Text
                align='center'
                weight='regular'
                className={styles.text}
            >
                {t('Funds will be credited to your account after processing is complete')}
            </Text>
        </CenteredContent>
    );
}