import { CurrencyAmountParts } from '../CurrencyAmountParts';
import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { PaymentSystem } from '@/states/cards/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TopupCard.module.scss';

type TopupCardProps = {
    typeId: number
    balance: number
    currency: string
    virtual?: boolean
    lastFourDigits: string
    paymentSystem: PaymentSystem
    className?: string
}

export function TopupCard({ typeId, balance, currency, virtual, lastFourDigits, className }: TopupCardProps) {
    const [t] = useTranslation();

    return (
        <div className={classNames(styles.root, className)}>
            <BankCardPreview
                typeId={typeId}
                virtual={virtual}
                lastFourDigits={lastFourDigits}
                className={styles.card}
            />
            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    <CurrencyAmountParts
                        value={balance}
                        currency={currency}
                    />
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Top-up account')}
                </Text>
            </div>
        </div>
    );
}