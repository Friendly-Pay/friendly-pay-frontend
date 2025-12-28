import { KeenSliderHooks, KeenSliderInstance } from 'keen-slider/react';
import { MutableRefObject, useEffect } from 'react';

export const useAutoplay = (
    slider: MutableRefObject<KeenSliderInstance<{}, {}, KeenSliderHooks> | null>,
    delay: number = 5_000
) => {
    useEffect(() => {
        const keenSlider = slider.current;
        if (!keenSlider) {
            return;
        }

        let timerId = 0;

        const goToNextSlide = () => {
            const totalSlides = keenSlider.track.details.slides.length;
            const currentSlide = keenSlider.track.details.rel;

            if (currentSlide < totalSlides - 1) {
                keenSlider.moveToIdx(currentSlide + 1);
            } else {
                stopAutoplay();
            }
        };

        const startAutoplay = () => {
            stopAutoplay();
            timerId = setInterval(goToNextSlide, delay);
        };

        const stopAutoplay = () => {
            if (timerId) {
                clearInterval(timerId);
                timerId = 0;
            }
        };

        const handleDragStarted = () => stopAutoplay();
        const handleDragEnded = () => startAutoplay();

        const handleSlideChanged = () => {
            stopAutoplay();
            startAutoplay();
        };

        keenSlider.on('dragStarted', handleDragStarted);
        keenSlider.on('dragEnded', handleDragEnded);
        keenSlider.on('slideChanged', handleSlideChanged);

        startAutoplay();

        return () => {
            stopAutoplay();
            keenSlider.on('dragStarted', handleDragStarted, true);
            keenSlider.on('dragEnded', handleDragEnded, true);
            keenSlider.on('slideChanged', handleSlideChanged, true);
        };
    }, [slider, delay]);
};