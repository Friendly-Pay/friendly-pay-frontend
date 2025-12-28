import { Confetti } from '../Confetti/Confetti';
import { useTimer } from '@/hooks/useTimer';
import { PaymentStatus, usePaymentStore } from '@/states/payment/store';
import { memo, useEffect, useState } from 'react';

/** Показывает конфети после успешной покупки карты */
export const ConfettiAfterPurchase = memo(function ConfettiAfterPurchase() {
    const status = usePaymentStore(state => state.purchaseStatus);
    const [visible, setVisible] = useState(false);

    const [startTimer] = useTimer();

    useEffect(() => {
        if (visible) {
            return;
        }
        if (status === PaymentStatus.Success) {
            startTimer(() => setVisible(true), 150);
            usePaymentStore.getState().resetCardPurchase();
        }
    }, [status]);

    // const handleTestClick = () => {
    //     setVisible(state => !state);
    // };

    // return (
    //     <>
    //         {visible && <Confetti />}

    //         {(
    //             <button
    //                 type="button"
    //                 onClick={handleTestClick}
    //                 style={{
    //                     position: 'fixed',
    //                     zIndex: 9999,
    //                     right: 16,
    //                     top: 'calc(var(--safe-area-top) + 36px)',
    //                     padding: '8px 12px',
    //                     borderRadius: 999,
    //                     border: 'none',
    //                     fontSize: 12,
    //                     cursor: 'pointer',
    //                     background: 'rgba(0,0,0,0.7)',
    //                     color: '#fff',
    //                 }}
    //             >
    //                 {visible ? 'Off confetti' : 'Test confetti'}
    //             </button>
    //         )}
    //     </>
    // );

    if (visible) {
        return (<Confetti />);
    } else {
        return null;
    }
});