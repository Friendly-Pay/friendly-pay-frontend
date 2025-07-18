declare namespace Telegram {
    interface AccelerometerOptions {
        refresh_rate?: number;
    }

    interface WebApp {
        Accelerometer: {
            x?: number;
            y?: number;
            z?: number;
            isStarted?: boolean;
            start: (options?: AccelerometerOptions) => void;
            stop: () => void;
        };
        onEvent(
            event: 'accelerometerStarted' | 'accelerometerStopped',
            callback: () => void,
        ): void;
        onEvent(
            event: 'accelerometerChanged',
            callback: () => void,
        ): void;
        onEvent(
            event: 'accelerometerFailed',
            callback: (data: { error: 'UNSUPPORTED' }) => void,
        ): void;

        offEvent(
            event: 'accelerometerStarted' | 'accelerometerStopped',
            callback: () => void,
        ): void;
        offEvent(
            event: 'accelerometerChanged',
            callback: () => void,
        ): void;
        offEvent(
            event: 'accelerometerFailed',
            callback: (data: { error: 'UNSUPPORTED' }) => void,
        ): void;

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