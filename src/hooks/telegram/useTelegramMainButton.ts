import { useDeviceStore } from '@/states/device/state';

export function useTelegramMainButton(): [boolean, {
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setParams: (params: globalThis.MainButtonParams) => void;
    subscribeClick: (handler: () => void) => void;
    unsubscribeClick: (handler: () => void) => void;
    showProgress: () => void;
    hideProgress: () => void;
}] {
    const webAppButton = window.Telegram?.WebApp.MainButton;
    const button = webAppButton;
    const platform = useDeviceStore(state => state.platform);
    const isAvailable = Boolean(button) && window.Telegram?.WebApp.isVersionAtLeast('6.1') && platform !== 'unknown';

    const hide = () => {
        if (isAvailable) button.hide();
    };

    const show = () => {
        if (isAvailable) button.show();
    };

    const setParams = (params: globalThis.MainButtonParams) => {
        if (!isAvailable || !params) return;
        if (webAppButton) {
            webAppButton.setParams({
                text: params.text,
                color: params.color,
                text_color: params.text_color,
                is_active: params.is_active,
                is_visible: params.is_visible,
                has_shine_effect: params.has_shine_effect
            });
        }
    };

    const subscribeClick = (handler: () => void) => {
        if (!isAvailable || typeof handler !== 'function') return;
        button.onClick(handler);
    };

    const unsubscribeClick = (handler: () => void) => {
        if (!isAvailable || typeof handler !== 'function') return;
        button.offClick(handler);
    };

    const showProgress = () => {
        if (isAvailable) button.showProgress();
    };

    const hideProgress = () => {
        if (isAvailable) button.hideProgress();
    };

    const enable = () => {
        if (!isAvailable) return;
        webAppButton?.enable();
    };

    const disable = () => {
        if (!isAvailable) return;
        webAppButton?.disable();
    };

    const actions = {
        show,
        hide,
        enable,
        disable,
        setParams,
        subscribeClick,
        unsubscribeClick,
        showProgress,
        hideProgress,
    };

    return [isAvailable, actions];
}