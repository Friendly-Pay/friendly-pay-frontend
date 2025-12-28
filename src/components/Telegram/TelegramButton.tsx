import { TelegramButtonProps } from './types';
import { useTelegramButton } from '@/hooks/telegram/useTelegramMainButton';
import { Button } from '@/uikit';
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styles from './TelegramButton.module.scss';

export const TelegramButton = memo(function TelegramButton({
    type,
    text = '',
    visible = true,
    disabled = false,
    loading = false,
    hasShineEffect = false,
    stayOnUnmount = false,
    position = 'left',
    onClick,
    fallbackComponent: FallbackComponent = Button,
}: TelegramButtonProps) {
    const {
        isAvailable,
        show,
        hide,
        setParams,
        setClickListener,
        showProgress,
        hideProgress,
    } = useTelegramButton(type);

    useEffect(() => {
        if (!isAvailable) return;

        const getButtonColors = () => {
            const root = getComputedStyle(document.documentElement);

            switch (type) {
                case 'main':
                    return {
                        color: root.getPropertyValue('--color-button-primary').trim(),
                        textColor: root.getPropertyValue('--color-button-primary-typo').trim(),
                        colorDisabled: root.getPropertyValue('--color-button-primary-disabled').trim(),
                        textColorDisabled: root.getPropertyValue('--color-button-primary-typo-disabled').trim()
                    };
                case 'secondary':
                    return {
                        color: root.getPropertyValue('--color-button-secondary').trim(),
                        textColor: root.getPropertyValue('--color-button-secondary-typo').trim(),
                        colorDisabled: root.getPropertyValue('--color-button-secondary-disabled').trim(),
                        textColorDisabled: root.getPropertyValue('--color-button-secondary-typo-disabled').trim(),
                    };
            }
        };

        const { color, colorDisabled, textColor, textColorDisabled } = getButtonColors();

        if (loading) {
            showProgress();
        } else {
            hideProgress();
        }

        const params: any = {
            text,
            color: disabled ? colorDisabled : color,
            text_color: disabled ? textColorDisabled : textColor,
            has_shine_effect: hasShineEffect,
            is_active: !disabled,
            is_visible: visible,
        };

        // Добавляем position только для secondary кнопки
        if (type === 'secondary') {
            params.position = position;
        }

        setParams(params);
    }, [
        isAvailable,
        disabled,
        loading,
        text,
        hasShineEffect,
        visible,
        type,
        position
    ]);

    const timerId = useRef(0);

    const clearTimer = useCallback(() => {
        if (timerId.current) {
            clearInterval(timerId.current);
        }
    }, []);

    // Управление видимостью
    useLayoutEffect(() => {
        if (!isAvailable) {
            return;
        }

        clearTimer();
        if (visible) {
            timerId.current = setTimeout(() => show(), 150);
        } else {
            hide();
        }

        return () => {
            clearTimer();
        };
    }, [visible, isAvailable, show, hide]);

    // Подписка на клики
    useEffect(() => {
        if (!onClick || !isAvailable) {
            return;
        }

        setClickListener(onClick);
    }, [onClick, setClickListener, isAvailable]);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (stayOnUnmount) return;
            if (isAvailable) {
                hideProgress();
                hide();
            }
        };
    }, [isAvailable, stayOnUnmount, hideProgress, hide]);

    if (!isAvailable) {
        if (!visible) return null;

        const fallbackProps = {
            view: type === 'main' ? 'primary' : 'secondary' as const,
            className: type === 'main' ? styles.fallbackMainButton : styles.fallbackSecondaryButton,
            disabled,
            loading,
            onClick,
            children: text,
        };

        return <FallbackComponent {...fallbackProps} />;
    }

    return null;
});