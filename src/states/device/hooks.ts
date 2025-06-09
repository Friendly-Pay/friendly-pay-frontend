import { useDeviceStore } from '@/states/device/state';
import { useEffect } from 'react';

const detectDeviceFromUserAgent = (userAgent: string) => {
    let deviceType = 'unknown';
    let os = 'unknown';

    if (/android/i.test(userAgent)) {
        deviceType = 'mobile';
        os = 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        deviceType = 'mobile';
        os = 'ios';
    } else if (/Windows NT/i.test(userAgent)) {
        deviceType = 'desktop';
        os = 'windows';
    } else if (/Macintosh/i.test(userAgent)) {
        deviceType = 'desktop';
        os = 'macos';
    }

    return { deviceType, os };
};

const mapPlatformToDevice = (platform: string) => {
    let deviceType = 'unknown';
    let os = 'unknown';
    const lowerPlatform = platform.toLowerCase();

    switch (lowerPlatform) {
        case 'android':
        case 'ios':
            deviceType = 'mobile';
            os = lowerPlatform;
            break;
        case 'macos':
        case 'windows':
        case 'linux':
            deviceType = 'desktop';
            os = lowerPlatform;
            break;
        case 'web':
        case 'weba':
            deviceType = 'browser';
            os = 'unknown';
            break;
        case 'tdesktop':
        case 'desktop':
            deviceType = 'desktop';
            os = 'unknown';
            break;
        default:
            const detectedDevice = detectDeviceFromUserAgent(navigator.userAgent);
            deviceType = detectedDevice.deviceType;
            os = detectedDevice.os;
            break;
    }

    return { deviceType, os };
};

export const useDetectDevice = () => {
    const setDeviceInfo = useDeviceStore((state) => state.setDeviceInfo);

    useEffect(() => {
        let platform = 'unknown';
        let deviceType = 'unknown';
        let os = 'unknown';

        if (window?.Telegram?.WebApp?.platform) {
            platform = window.Telegram.WebApp.platform;
            const mappedDevice = mapPlatformToDevice(platform);
            deviceType = mappedDevice.deviceType;
            os = mappedDevice.os;
        } else {
            const detectedDevice = detectDeviceFromUserAgent(navigator.userAgent);
            deviceType = detectedDevice.deviceType;
            os = detectedDevice.os;
        }

        setDeviceInfo(deviceType, os, platform);
    }, [setDeviceInfo]);
};

export const useFullscreenListener = () => {
    const telegramWebApp = window.Telegram.WebApp;
    const setFullscreen = useDeviceStore(state => state.setFullscreen);

    useEffect(() => {
        const handleFullscreenChange = ({ isFullscreen }: { isFullscreen: boolean }) => {
            // eslint-disable-next-line no-console
            console.log('[fullscreen]', isFullscreen);
            setFullscreen(isFullscreen);
        };

        telegramWebApp.onEvent('fullscreenChanged', handleFullscreenChange);
        return () => {
            telegramWebApp.offEvent('fullscreenChanged', handleFullscreenChange);
        };
    }, []);
};