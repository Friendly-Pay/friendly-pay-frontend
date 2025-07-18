import { useUserStore } from '@/states/user/store';
import { useEffect, useRef } from 'react';

const Z_THRESHOLD_UP = -7;
const Z_THRESHOLD_DOWN = 1;
const REFRESH_RATE_MS = 160;

export function ShakeToHideBalances() {
    const cooldown = useRef(false);
    const isFlipped = useRef(false);
    const setBlurBalance = useUserStore(state => state.setBlurBalance);

    useEffect(() => {
        if (!window.Telegram.WebApp.Accelerometer?.start) return;
        let animationFrame: any;

        const handler = () => {
            if (!window.Telegram.WebApp.Accelerometer || !window.Telegram.WebApp.Accelerometer.isStarted) return;
            const { x, y, z } = window.Telegram.WebApp.Accelerometer;
            if (
                cooldown.current ||
                typeof x !== 'number' ||
                typeof y !== 'number' ||
                typeof z !== 'number'
            ) {
                return;
            }

            if (isFlipped.current) {
                if (z < Z_THRESHOLD_UP) {
                    isFlipped.current = false;
                    animationFrame = requestAnimationFrame(() => {
                        const blurBalance = useUserStore.getState().blurBalance;
                        setBlurBalance(!blurBalance);
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid');
                    });
                }
            } else {
                if (z > Z_THRESHOLD_DOWN) {
                    isFlipped.current = true;
                }
            }
        };

        window.Telegram.WebApp.Accelerometer.start({ refresh_rate: REFRESH_RATE_MS });
        window.Telegram.WebApp.onEvent('accelerometerChanged', handler);

        return () => {
            window.Telegram.WebApp.offEvent('accelerometerChanged', handler);
            window.Telegram.WebApp.Accelerometer.stop();
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return null;
}