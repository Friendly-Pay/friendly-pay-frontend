import { BasicBanner } from './BasicBanner';
import depositImage from 'assets/iban/deposit.png?inline';
import paymentImage from 'assets/iban/payments.png?inline';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './IbanBanners.module.scss';

type IbanBannersProps = {
    className?: string
}

export const IBAN_BANNERS_IMAGES = {
    deposit: depositImage,
    payment: paymentImage
};

export function IbanBanners({ className }: IbanBannersProps) {
    const [t] = useTranslation();
    return (
        <div className={classNames(styles.grid, className)}>
            <BasicBanner
                image={IBAN_BANNERS_IMAGES.deposit}
                style={{ backgroundColor: 'var(--iban-deposit-banner-color)' }}
            >
                <div dangerouslySetInnerHTML={{ __html: t('Receive money<br />to your account') }} />
            </BasicBanner>
            <BasicBanner
                image={IBAN_BANNERS_IMAGES.payment}
                style={{ backgroundColor: 'var(--iban-payment-banner-color)' }}
            >
                <div dangerouslySetInnerHTML={{ __html: t('Send money<br />worldwide') }} />
            </BasicBanner>
        </div>
    );
}