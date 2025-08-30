import { ClickableBanner } from './ClickableBanner';
import { safeLanguageCode } from '@/localization/utils';
import { useDeviceStore } from '@/states/device/state';
import { useUserStore } from '@/states/user/store';
import { openWebviewLink } from '@/utils';
import appleBanner from 'assets/apple_banner.png?inline';
import googleBanner from 'assets/google_banner.png?inline';
import { useTranslation } from 'react-i18next';

type WalletBannerProps = {
    hasAppleWallet: boolean
    hasGooglePay: boolean
    className?: string
}

const GUIDE = {
    ru: {
        applePay: 'https://telegra.ph/Kak-dobavit-v-apple-pay-08-11',
        googlePay: 'https://telegra.ph/Kak-dobavit-kartu-v-Google-Wallet-08-11'
    },
    en: {
        applePay: 'https://telegra.ph/How-to-add-a-Card-to-Apple-Pay-08-11',
        googlePay: 'https://telegra.ph/How-to-add-a-card-to-Google-Pay-08-11'
    }
};

export function WalletBanner({ hasAppleWallet, hasGooglePay, className }: WalletBannerProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);
    const platform = useDeviceStore(state => state.platform);
    const isIos = platform === 'ios' || platform === 'macos';
    const title = isIos ? 'Apple Pay' : 'Google Pay';

    const handleClick = () => {
        let link: string;
        if (locale === 'ru') {
            if (hasAppleWallet) {
                link = GUIDE.ru.applePay;
            } else {
                link = GUIDE.ru.googlePay;
            }
        } else {
            if (hasAppleWallet) {
                link = GUIDE.en.applePay;
            } else {
                link = GUIDE.en.googlePay;
            }
        }
        openWebviewLink(link, { try_instant_view: true });
    };

    if (isIos && !hasAppleWallet) {
        return null;
    }
    if (!isIos && !hasGooglePay) {
        return null;
    }
    return (
        <>
            <ClickableBanner
                image={isIos ? appleBanner : googleBanner}
                title={title}
                text={t('Add card to wallet')}
                className={className}
                onClick={handleClick}
            />
        </>
    );
}