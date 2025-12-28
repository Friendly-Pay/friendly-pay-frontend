import { useDeviceStore } from '@/states/device/state';
import { useCallback, useEffect, useRef } from 'react';

interface UseTelegramButtonReturn {
    isAvailable: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setParams: (params: any) => void;
    setClickListener: (handler: () => void) => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
}

type ButtonType = 'main' | 'secondary';

const MIN_TELEGRAM_VERSION_SUPPORTED = '7.10';

export const isTelegramVersionSupported = () => {
    const webApp = window.Telegram?.WebApp;
    return webApp?.isVersionAtLeast(MIN_TELEGRAM_VERSION_SUPPORTED);
};

export function useTelegramButton(buttonType: ButtonType): UseTelegramButtonReturn {
    const webApp = window.Telegram?.WebApp;
    const button = buttonType === 'main' ? webApp?.MainButton : webApp?.SecondaryButton;
    const platform = useDeviceStore(state => state.platform);

    const minVersion = buttonType === 'main' ? '6.1' : '7.10';
    const isAvailable = Boolean(button) && webApp?.isVersionAtLeast(minVersion) && platform !== 'unknown';

    const hide = useCallback(() => {
        if (isAvailable) button!.hide();
    }, [isAvailable, button]);

    const show = useCallback(() => {
        if (isAvailable) button!.show();
    }, [isAvailable, button]);

    const setParams = useCallback((params: any) => {
        if (!isAvailable || !params) return;
        button!.setParams(params);
    }, [isAvailable, button]);

    const currentHandlerRef = useRef<(() => void) | null>(null);

    // Единый обработчик, который вызывает текущий обработчик из ref
    const handleClick = useCallback(() => {
        if (currentHandlerRef.current) {
            currentHandlerRef.current();
        }
    }, []);

    // Подписываемся на событие один раз при монтировании
    useEffect(() => {
        if (!isAvailable) return;
        button!.onClick(handleClick);
        return () => {
            button!.offClick(handleClick);
        };
    }, [isAvailable, buttonType, webApp, handleClick]);

    const setClickListener = useCallback((handler: (() => void) | null) => {
        currentHandlerRef.current = handler;
    }, []);

    const showProgress = useCallback((leaveActive?: boolean) => {
        if (isAvailable) {
            button!.showProgress(leaveActive);
        }
    }, [isAvailable, button]);

    const hideProgress = useCallback(() => {
        if (isAvailable) {
            button!.hideProgress();
        }
    }, [isAvailable, button]);

    const enable = useCallback(() => {
        if (isAvailable) {
            button!.enable();
        }
    }, [isAvailable, button]);

    const disable = useCallback(() => {
        if (isAvailable) {
            button!.disable();
        }
    }, [isAvailable, button]);

    return {
        isAvailable,
        show,
        hide,
        enable,
        disable,
        setParams,
        setClickListener,
        showProgress,
        hideProgress,
    };
}