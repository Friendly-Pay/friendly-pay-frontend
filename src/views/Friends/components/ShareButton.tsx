import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useFriendsBonusesStore } from '@/states/friends/store';
import { copyToClipboard } from '@/utils';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function ShareButton() {
    const [t] = useTranslation();
    const referralId = useFriendsBonusesStore(state => state.referralId);
    const referralLink = `https://t.me/gpton_pay_bot?start=r${referralId}`;

    const handleCopyLink = useCallback(async () => {
        const sanitized = String(referralLink).replace(/\s+/g, '');
        await copyToClipboard(sanitized);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        toast.success(t('Link copied'));
    }, [referralLink, t]);

    return (
        <TelegramMainButton
            visible
            text='Скопировать ссылку'
            onClick={handleCopyLink}
        />
    );
}