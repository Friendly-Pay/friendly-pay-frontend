import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
    const previousRef = useRef<T | undefined>(undefined);
    useEffect(() => {
        previousRef.current = value;
    }, [value]);
    return previousRef.current;
}