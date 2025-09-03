import { BankCard } from '@/components/Bank/BankCard';
import { ArrowRight } from '@/components/Icons/Arrow';
import { languageCodeToLocale } from '@/localization/utils';
import { CardLimits, PaymentSystem } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { formatExpireDaysAsMonths } from '@/utils/date';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardProduct.module.scss';

type CardProductProps = {
    name: string
    price: number
    cashback?: number
    expireDays: number
    depositFee: number
    limits: CardLimits
    typeId: number
    virtual?: boolean
    hasApplePay: boolean
    hasGoogleWallet: boolean
    paymentSystem: PaymentSystem
    description?: string
    className?: string
    onCardSelect?: () => void
}

export function CardProduct({ name, price, depositFee, cashback, expireDays, limits, typeId, paymentSystem, description, hasApplePay, hasGoogleWallet, className, onCardSelect }: CardProductProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);

    return (
        <div className={classNames(styles.root, className)}>
            <div
                className={styles.head}
                onClick={onCardSelect}
            >
                <div className={styles.top}>
                    <Text
                        type='title'
                        align='left'
                        weight='semibold'
                    >
                        {name}
                    </Text>

                    <div className={styles.arrow}>
                        <ArrowRight />
                    </div>
                </div>

                {description && <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.description}
                >
                    {t(description)}
                </Text>}

                {!hasApplePay && !hasGoogleWallet
                    ? <Text
                        type='caption'
                        align='left'
                        weight='regular'
                        className={styles.notSupportsApplePay}
                    >
                        {t('NOT SUPPORTED APPLE PAY / GOOGLE PAY. Online payments only')}
                    </Text>
                    : <Text
                        type='caption'
                        align='left'
                        weight='regular'
                        className={styles.supportsApplePay}
                    >
                        {t('SUPPORTED APPLE PAY / GOOGLE PAY')}
                    </Text>}
            </div>

            <div className={styles.content}>
                <BankCard
                    typeId={typeId}
                    hideDigits
                    paymentSystem={paymentSystem}
                    className={styles.card}
                    onClick={onCardSelect}
                />

                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.price}
                >
                    Стоимость выпуска карты: <span>{formatCurrency(price, 'usd', languageCodeToLocale(languageCode), 0)}</span>
                </Text>

                <div className={styles.data}>
                    <div className={styles.item}>
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                            className={styles.itemValue}
                        >{formatCurrency(limits.purchase.day, 'usd', languageCodeToLocale(languageCode), 0)}</Text>
                        <Text
                            type='captionSmall'
                            align='center'
                            weight='regular'
                            className={styles.itemText}

                        ><div dangerouslySetInnerHTML={{ __html: t('Daily<br/> limit') }} /></Text>
                    </div>
                    <div className={styles.item}>
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                            className={styles.itemValue}
                        >{depositFee}%</Text>
                        <Text
                            type='captionSmall'
                            align='center'
                            weight='regular'
                            className={styles.itemText}
                        ><div dangerouslySetInnerHTML={{ __html: t('Top-up<br/> fee') }} /></Text>
                    </div>
                    {cashback && <div className={styles.item}>
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                            className={styles.itemValue}
                        >{formatCurrency(cashback, 'usd', languageCodeToLocale(languageCode), 0)}</Text>
                        <Text
                            type='captionSmall'
                            align='center'
                            weight='regular'
                            className={styles.itemText}
                        ><div dangerouslySetInnerHTML={{ __html: t('Opening<br/> balance') }} /></Text>
                    </div>}
                    <div className={styles.item}>
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                            className={styles.itemValue}
                        >{formatExpireDaysAsMonths(expireDays)}</Text>
                        <Text
                            type='captionSmall'
                            align='center'
                            weight='regular'
                            className={styles.itemText}
                        ><div dangerouslySetInnerHTML={{ __html: t('Expiration<br/> date') }} /></Text>
                    </div>
                </div>
            </div>
        </div>
    );
}