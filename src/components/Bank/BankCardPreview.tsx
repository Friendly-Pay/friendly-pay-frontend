import { Cloud } from '../Icons/Cloud';
import { CardDesign } from './CardDesign';
import { PaymentSystemIcon } from './PaymentSystemIcon';
import { PaymentSystem } from '@/states/cards/store';
import classNames from 'classnames';
import styles from './BankCardPreview.module.scss';

type BankCardPreviewProps = {
    cardTypeId: number
    lastFourDigits?: string,
    paymentSystem?: PaymentSystem
    virtual?: boolean;
    className?: string
    onClick?: () => void
}

export function BankCardPreview({ cardTypeId, lastFourDigits, paymentSystem, virtual, className, onClick }: BankCardPreviewProps) {
    return (
        <CardDesign
            preview
            cardTypeId={cardTypeId}
            className={classNames(styles.card, className)}
            backgroundClassName={styles.background}
            onClick={onClick}
        >
            {virtual && <div className={styles.cloud}><Cloud /></div>}

            {lastFourDigits && <div className={styles.lastFourDigits}>
                {lastFourDigits}
            </div>}

            {paymentSystem && <div className={styles.paymentSystem}>
                <PaymentSystemIcon
                    paymentSystem={paymentSystem}
                    forCardPreview
                />
            </div>}
        </CardDesign>
    );
}