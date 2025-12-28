import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export interface TPaymentButtonsContext {
    buttonsVisible: boolean;
    showButtons: (delay?: number) => void;
    hideButtons: () => void;
}

const mockFn = () => { };

export const PaymentButtonsContext = createContext<TPaymentButtonsContext>({
    buttonsVisible: false,
    showButtons: mockFn,
    hideButtons: mockFn
});

/** Позволяет синхронно скрывать и показывать кнопки с разной задержкой:
 * 1) быстро скрывать (0мс)
 * 2) плавно показывать (300мс)
 * 
 * Во всем приложении через единый провайдер */
export const usePaymentButtonsVisibility = () => {
    return useContext(PaymentButtonsContext);
};

export const PaymentButtonsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [buttonsVisible, setButtonsVisible] = useState(false);

    const timerRef = useRef(0);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const hideButtons = useCallback(() => {
        clearTimer();
        setButtonsVisible(false);
    }, [clearTimer, setButtonsVisible]);

    const showButtons = useCallback((delay = 300) => {
        clearTimer();

        timerRef.current = setTimeout(() => {
            setButtonsVisible(true);
        }, delay);
    }, [clearTimer, setButtonsVisible]);

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    const value = useMemo(
        () => ({ buttonsVisible, hideButtons, showButtons }),
        [buttonsVisible, hideButtons, showButtons],
    );

    return (
        <PaymentButtonsContext.Provider value={value} >
            {children}
        </PaymentButtonsContext.Provider>
    );
};