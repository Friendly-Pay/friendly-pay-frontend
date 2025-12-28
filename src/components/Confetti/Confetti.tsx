import confetti from 'canvas-confetti';
import { useCallback, useLayoutEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiRef = useRef<any>(null);

    const launchConfetti = useCallback(() => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        confettiRef.current({
            particleCount: 70,
            origin: { x: 0, y: 0.8 },
            angle: 60,
            spread: 50,
            startVelocity: 60,
            scalar: 1.5
        });
        confettiRef.current({
            particleCount: 70,
            origin: { x: 1, y: 0.8 },
            angle: 120,
            spread: 50,
            startVelocity: 60,
            scalar: 1.5
        });
    }, []);

    useLayoutEffect(() => {
        if (canvasRef.current && !confettiRef.current) {
            confettiRef.current = confetti.create(canvasRef.current, { resize: true });
        }

        const frameId = requestAnimationFrame(() => {
            launchConfetti();
        });

        return () => {
            cancelAnimationFrame(frameId);
            confetti.reset();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
            }}
        />
    );
};