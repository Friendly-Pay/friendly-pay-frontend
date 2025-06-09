import { create } from 'zustand';

interface Area {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

const getSafeAreaInset = () =>
    window.Telegram.WebApp.isVersionAtLeast('8.0')
        ? (window.Telegram.WebApp as any).safeAreaInset as Area
        : { top: 0, bottom: 0, left: 0, right: 0 };

const getContentSafeAreaInset = () =>
    window.Telegram.WebApp.isVersionAtLeast('8.0')
        ? (window.Telegram.WebApp as any).contentSafeAreaInset as Area
        : { top: 0, bottom: 0, left: 0, right: 0 };

interface State {
    deviceType: string;
    os: string;
    platform: string;
    fullscreen: boolean;
    safeAreaInset: { top: number; bottom: number; left: number; right: number };
    contentSafeAreaInset: { top: number; bottom: number; left: number; right: number };
}

interface Actions {
    setDeviceInfo: (deviceType: string, os: string, platform: string) => void;
    setFullscreen: (fullscreen: boolean) => void;
}

export const useDeviceStore = create<State & Actions>((set) => ({
    deviceType: 'unknown',
    os: 'unknown',
    platform: 'unknown',
    fullscreen: window.Telegram.WebApp.isVersionAtLeast('8.0'),
    safeAreaInset: getSafeAreaInset(),
    contentSafeAreaInset: getContentSafeAreaInset(),

    setDeviceInfo: (deviceType, os, platform) =>
        set({ deviceType, os, platform }),

    setFullscreen: (fullscreen) =>
        set({ fullscreen }),
}));