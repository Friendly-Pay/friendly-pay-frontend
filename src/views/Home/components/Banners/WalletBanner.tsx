import { ClickableBanner } from './ClickableBanner';
import { WalletModal } from './WalletModal';
import { useDeviceStore } from '@/states/device/state';
import appleBanner from 'assets/banner/apple_pay_banner.png?inline';
import googleBanner from 'assets/banner/google_pay_banner.png?inline';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type WalletBannerProps = {
    hasAppleWallet: boolean
    hasGooglePay: boolean
    className?: string
}

export function WalletBanner({ hasAppleWallet, hasGooglePay, className }: WalletBannerProps) {
    const [t] = useTranslation();
    const [opened, setOpened] = useState(false);
    const platform = useDeviceStore(state => state.platform);
    const isIos = platform === 'ios' || platform === 'macos';
    const title = isIos ? 'Apple Pay' : 'Google Pay';

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
                text={t('Instruction')}
                className={className}
                onClick={() => setOpened(true)}
            />

            <WalletModal
                isOpen={opened}
                title={title}
                platform={isIos ? 'ios' : 'android'}
                onClose={() => setOpened(false)}
            />
        </>
    );
}