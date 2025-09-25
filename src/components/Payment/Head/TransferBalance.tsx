import { CurrencyAmountParts } from '../CurrencyAmountParts';
import { Image } from '@/components/Image/Image';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './TransferBalance.module.scss';

type TransferBalanceProps = {
    label: string
    image: string
    value: number
    currency: string
    className?: string
}

export function TransferBalance({ value, currency, label, image, className }: TransferBalanceProps) {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.icon}>
                <Image
                    src={image}
                    alt=''
                />
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    <CurrencyAmountParts
                        value={value}
                        currency={currency}
                    />
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                >
                    {label}
                </Text>
            </div>
        </div>
    );
}