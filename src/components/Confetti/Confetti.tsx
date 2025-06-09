import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';

type ConfettiProps = {
    onAnimationCompleted?: () => void
}

export function Confetti({ }: ConfettiProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiRef = useRef<any>(null);

    const launchConfetti = () => {
        confettiRef.current({
            particleCount: 60,
            origin: { x: 0, y: 0.8 },
            angle: 60,
            spread: 50,
            startVelocity: 50,
            scalar: 1.5
        });
        confettiRef.current({
            particleCount: 60,
            origin: { x: 1, y: 0.8 },
            angle: 120,
            spread: 50,
            startVelocity: 50,
            scalar: 1.5
        });
    };

    useEffect(() => {
        if (canvasRef.current && !confettiRef.current) {
            confettiRef.current = confetti.create(canvasRef.current, { resize: true });
        }
        launchConfetti();
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
}