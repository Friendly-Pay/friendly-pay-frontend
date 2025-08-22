import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { PaymentSystemName } from '@/components/Bank/PaymentSystemName';
import { ArrowRight } from '@/components/Icons/Arrow';
import { CurrencyAmountParts } from '@/components/Payment/CurrencyAmountParts';
import { MyCard } from '@/states/cards/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardItem.module.scss';

type CardItemProps = {
    card: MyCard
    className?: string
    onClick?: () => void
}

export function CardItem({ card, className, onClick }: CardItemProps) {
    const [t] = useTranslation();
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <BankCardPreview
                typeId={card.typeId}
                virtual={card.isVirtual}
                lastFourDigits={card.number!}
                className={styles.cardPreview}
            />

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    <CurrencyAmountParts
                        value={card.balance}
                        currency={card.currency}
                    />
                </Text>

                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Card')} <PaymentSystemName paymentSystem={card.paymentSystem} />
                </Text>
            </div>

            <div className={styles.arrow}>
                <ArrowRight />
            </div>
        </div>
    );
}