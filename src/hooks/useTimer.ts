import { useCallback, useEffect, useRef } from 'react';

type UseTimer = () => [(callback: () => void, delay: number) => void, () => void];

export const useTimer: UseTimer = () => {
    const timerId = useRef(0);

    const clearTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    }, []);

    const startTimer = useCallback((callback: () => void, ms: number) => {
        clearTimer();
        timerId.current = setTimeout(callback, ms);
    }, [clearTimer]);

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    return [startTimer, clearTimer];
};