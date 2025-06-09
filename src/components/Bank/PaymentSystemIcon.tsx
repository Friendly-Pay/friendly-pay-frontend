import { Mastercard } from '../Icons/Mastercard';
import { Visa } from '../Icons/Visa';
import { PaymentSystem } from '@/states/cards/store';
import classNames from 'classnames';
import styles from './PaymentSystemIcon.module.scss';

type PaymentSystemIconProps = {
    paymentSystem: PaymentSystem
    forCardPreview?: boolean
}

export function PaymentSystemIcon({ paymentSystem, forCardPreview }: PaymentSystemIconProps) {
    let paymentSystemIcon: any = null;
    switch (paymentSystem) {
        case PaymentSystem.Visa:
            paymentSystemIcon = <Visa className={classNames(styles.visa, forCardPreview && styles.visaSmall)} />;
            break;
        case PaymentSystem.Mastercard:
            paymentSystemIcon = <Mastercard className={classNames(styles.mastercard, forCardPreview && styles.mastercardSmall)} />;
            break;
    }
    return paymentSystemIcon;
}