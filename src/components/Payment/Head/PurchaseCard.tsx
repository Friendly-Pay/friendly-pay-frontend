import { BankCardPreview } from '@/components/Bank/BankCardPreview';
import { PaymentSystem } from '@/states/cards/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './PurchaseCard.module.scss';

type PurchaseCardProps = {
    name: string
    typeId: number
    paymentSystem: PaymentSystem
    className?: string
}

export function PurchaseCard({ name, typeId, paymentSystem, className }: PurchaseCardProps) {
    const [t] = useTranslation();

    return (
        <div className={classNames(styles.root, className)}>
            <BankCardPreview
                typeId={typeId}
                paymentSystem={paymentSystem}
                className={styles.card}
            />
            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    {name}
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Selected card')}
                </Text>
            </div>
        </div>
    );
}