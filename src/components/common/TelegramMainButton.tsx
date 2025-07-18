import { useTelegramMainButton } from '@/hooks/telegram/useTelegramMainButton';
import { Button } from '@/uikit';
import { memo, useEffect } from 'react';
import styles from './TelegramMainButton.module.scss';

export interface TelegramMainButtonProps {
    text?: string;
    visible?: boolean;
    disabled?: boolean;
    loading?: boolean;
    hasShineEffect?: boolean;
    onClick?: () => void;
}

export const TelegramMainButton = memo(function TelegramMainButton({
    text = '',
    visible = true,
    disabled = false,
    loading = false,
    hasShineEffect = false,
    onClick,
}: TelegramMainButtonProps) {
    const [isAvailable, actions] = useTelegramMainButton();
    const {
        hide,
        setParams,
        subscribeClick,
        unsubscribeClick,
        showProgress,
        hideProgress,
    } = actions;

    useEffect(() => {
        if (!isAvailable) return;
        const root = getComputedStyle(document.documentElement);
        const color = root.getPropertyValue('--color-button-primary').trim();
        const textColor = root.getPropertyValue('--color-white').trim();
        const colorDisabled = root.getPropertyValue('--color-button-primary-disabled').trim();
        if (loading) {
            showProgress();
        } else {
            hideProgress();
        }
        setParams({
            text,
            color: disabled ? colorDisabled : color,
            text_color: textColor,
            has_shine_effect: hasShineEffect,
            is_active: !disabled,
            is_visible: visible
        });
    }, [
        isAvailable,
        visible,
        disabled,
        loading,
        text,
        hasShineEffect
    ]);

    useEffect(() => {
        if (!onClick) return;
        subscribeClick(onClick);
        return () => {
            unsubscribeClick(onClick);
        };
    }, [onClick]);

    useEffect(() => {
        return () => {
            hideProgress();
            hide();
        };
    }, []);

    if (!isAvailable) {
        if (!visible) return null;
        return (
            <Button
                view='primary'
                className={styles.fallbackButton}
                disabled={disabled}
                loading={loading}
                onClick={onClick}
            >{text}</Button>
        );
    }
});