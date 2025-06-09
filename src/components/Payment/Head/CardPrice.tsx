import { CurrencyAmountParts } from '../CurrencyAmountParts';
import { Dollar } from '@/components/Icons/Dollar';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardPrice.module.scss';

type CardPriceProps = {
    price: number
    currency: string
    className?: string
}

export function CardPrice({ price, currency, className }: CardPriceProps) {
    const [t] = useTranslation();

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.currencyIcon}>
                <Dollar />
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    <CurrencyAmountParts
                        value={price}
                        currency={currency}
                    />
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Cost')}
                </Text>
            </div>
        </div>
    );
}