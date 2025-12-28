import { FormattedAmount } from '@/components/Amount/FormattedAmount';
import { ArrowDown } from '@/components/Icons/Arrow';
import { Image } from '@/components/Image/Image';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Text } from '@/uikit';
import { toMinorUnits } from '@/utils/math';
import classNames from 'classnames';
import styles from './PaymentCurrency.module.scss';

type PaymentCurrencyProps = {
    /** Выбранная валюта платежа */
    currency: PaymentCurrencyUI | null

    /** Сумма платежа, @null для loading */
    amount?: number | null

    /** Плейсхолдер текст, когда валюта не выбрана */
    placeholderText: string;

    /** Текст описание для валюты */
    labelText: string;

    className?: string
    onClick?: () => void
}

export interface PaymentCurrencyUI {
    name: string
    image: string
    minority: number
    mnemonicCode: string
}

export function PaymentCurrency({
    currency,
    amount,
    placeholderText,
    labelText,
    className,
    onClick
}: PaymentCurrencyProps) {
    const getTitle = () => {
        if (amount && currency) {
            const amountMinor = toMinorUnits(amount, currency.minority);
            return (
                <FormattedAmount
                    value={amountMinor}
                    minority={currency.minority}
                    currency={currency.mnemonicCode}
                />
            );
        } else if (amount === null) {
            return (
                <Skeleton className={styles.titleSkeleton} />
            );
        } else {
            return currency?.name;
        }
    };

    const getCurrencyContent = () => {
        if (currency) {
            const title = getTitle();

            return (
                <>
                    <div className={styles.currencyIcon}>
                        <Image
                            src={currency.image}
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
                            {title}
                        </Text>
                        <Text
                            type='caption'
                            align='left'
                            weight='regular'
                            className={styles.text}
                        >
                            {labelText}
                        </Text>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className={styles.currencyIcon}>
                    <PlaceholderIcon />
                </div>

                <div className={styles.content}>
                    <Text
                        type='caption'
                        align='left'
                        weight='regular'
                        className={classNames(styles.text, styles.placeholderText)}
                    >
                        {placeholderText}
                    </Text>
                </div>
            </>
        );
    };

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            {getCurrencyContent()}

            <div className={styles.arrow}>
                <ArrowDown />
            </div>
        </div>
    );
}

export const PlaceholderIcon = () => {
    return (
        <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="38"
                height="38"
                rx="19"
                fill="#FFFFFF"
                fillOpacity="0.08"
            />
            <path
                d="M12.3242 19.1122C12.3242 18.8287 12.4259 18.5853 12.6291 18.3821C12.8324 18.1788 13.0758 18.0772 13.3593 18.0772H18.0852V13.3593C18.0852 13.0758 18.1842 12.8324 18.3821 12.6291C18.58 12.4259 18.8234 12.3242 19.1122 12.3242C19.3957 12.3242 19.6391 12.4259 19.8424 12.6291C20.0456 12.8324 20.1473 13.0758 20.1473 13.3593V18.0772H24.8733C25.1514 18.0772 25.3921 18.1788 25.5954 18.3821C25.7986 18.5853 25.9003 18.8287 25.9003 19.1122C25.9003 19.4011 25.7986 19.6471 25.5954 19.8504C25.3921 20.0483 25.1514 20.1473 24.8733 20.1473H20.1473V24.8733C20.1473 25.1514 20.0456 25.3921 19.8424 25.5954C19.6391 25.7986 19.3957 25.9003 19.1122 25.9003C18.8234 25.9003 18.58 25.7986 18.3821 25.5954C18.1842 25.3921 18.0852 25.1514 18.0852 24.8733V20.1473H13.3593C13.0758 20.1473 12.8324 20.0483 12.6291 19.8504C12.4259 19.6471 12.3242 19.4011 12.3242 19.1122Z"
                fill="#FFFFFF"
                fillOpacity="0.35"
            />
        </svg>
    );
};