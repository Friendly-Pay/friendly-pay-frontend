import { BankCard } from '@/components/Bank/BankCard';
import { ArrowRight } from '@/components/Icons/Arrow';
import { languageCodeToLocale } from '@/localization/utils';
import { CardLimits, PaymentSystem } from '@/states/cards/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardProduct.module.scss';

type CardProductProps = {
    name: string
    price: number
    depositFee: number
    limits: CardLimits
    typeId: number
    virtual?: boolean
    paymentSystem: PaymentSystem
    description?: string
    className?: string
    onCardSelect?: () => void
}

export function CardProduct({ name, price, depositFee, limits, typeId, paymentSystem, description, className, onCardSelect }: CardProductProps) {
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
            </div>

            <div className={styles.content}>
                <BankCard
                    cardTypeId={typeId}
                    hideLastFourDigits
                    paymentSystem={paymentSystem}
                    className={styles.card}
                    onClick={onCardSelect}
                />

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
                    <div className={styles.item}>
                        <Text
                            type='body'
                            align='center'
                            weight='semibold'
                            className={styles.itemValue}
                        >{formatCurrency(price, 'usd', languageCodeToLocale(languageCode), 0)}</Text>
                        <Text
                            type='captionSmall'
                            align='center'
                            weight='regular'
                            className={styles.itemText}
                        ><div dangerouslySetInnerHTML={{ __html: t('Card<br/> issue fee') }} /></Text>
                    </div>
                </div>
            </div>
        </div>
    );
}