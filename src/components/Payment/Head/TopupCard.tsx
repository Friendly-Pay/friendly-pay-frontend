import { CurrencyAmountParts } from '../CurrencyAmountParts';
import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { ArrowDown } from '@/components/Icons/Arrow';
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
    canSelect?: boolean
    className?: string
    onClick?: () => void
}

export function TopupCard({ typeId, balance, currency, virtual, lastFourDigits, canSelect, className, onClick }: TopupCardProps) {
    const [t] = useTranslation();

    return (
        <div
            className={classNames(styles.root, canSelect && styles.clickable, className)}
            onClick={onClick}
        >
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

            {canSelect && <div className={styles.arrow}>
                <ArrowDown />
            </div>}
        </div>
    );
}