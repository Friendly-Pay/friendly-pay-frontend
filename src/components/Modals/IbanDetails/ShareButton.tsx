import { Button } from '@/uikit';
import { openTelegramLink } from '@/utils';
import { PropsWithChildren } from 'react';

type ShareButtonProps = {
    shareText: string;
    className?: string;
}

export function ShareButton({ shareText, children, className }: PropsWithChildren<ShareButtonProps>) {
    const handleShare = async () => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        const shareUrl = window.location.href;
        const params = `url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        openTelegramLink(`https://t.me/share/url?${params.toString()}`);
    };

    return (
        <Button
            view='primary'
            className={className}
            onClick={handleShare}
        >
            {children}
        </Button>
    );
}