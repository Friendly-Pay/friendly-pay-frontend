import { PaymentSystem } from '@/states/cards/store';

type PaymentSystemNameProps = {
    paymentSystem: PaymentSystem
}

export function PaymentSystemName({ paymentSystem }: PaymentSystemNameProps) {
    let paymentSystemName: any = null;
    switch (paymentSystem) {
        case PaymentSystem.Visa:
            paymentSystemName = 'Visa';
            break;
        case PaymentSystem.Mastercard:
            paymentSystemName = 'MasterCard';
            break;
    }
    return paymentSystemName;
}