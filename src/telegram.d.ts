declare namespace Telegram {
    interface WebApp {
        lockOrientation: () => void;
        onEvent(
            event: 'fullscreenChanged',
            callback: (data: { isFullscreen: boolean }) => void
        ): void;
        offEvent(
            event: 'fullscreenChanged',
            callback: (data: { isFullscreen: boolean }) => void
        ): void;
    }
}

interface Window {
    Telegram: {
        WebApp?: Telegram.WebApp;
    };
}