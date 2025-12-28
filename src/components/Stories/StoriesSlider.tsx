import { useAutoplay } from './hooks';
import { useStoriesStore } from './store';
import { StoriesNavigation } from './StoriesNavigation';
import { type KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import { ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import 'keen-slider/keen-slider.min.css';
import styles from './StoriesSlider.module.scss';

type StoriesSliderProps = {
    children: ReactNode[]
    className?: string
}

export function StoriesSlider({
    children,
    className
}: StoriesSliderProps) {
    const options = useRef<KeenSliderOptions>({
        mode: 'snap',
        slides: {
            origin: 'center',
            perView: 1,
            spacing: 0,
        },
        loop: false,
        drag: true,
        dragSpeed: 1,
        vertical: false,
        rubberband: false,
        defaultAnimation: {
            duration: 217,
            easing: (t) => {
                return 1 - Math.pow(1 - t, 2);
            }
        },
    });

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(options.current);

    useAutoplay(slider, 10_000);

    useEffect(() => {
        useStoriesStore.getState().reset();

        const keenSlider = slider.current;
        if (!keenSlider) {
            return;
        }

        const handleSlide = (slider: any) => {
            const index = slider.track.details.rel;
            useStoriesStore.getState().setActiveIndex(index);
        };

        keenSlider.on('slideChanged', handleSlide);
        return () => {
            keenSlider.on('slideChanged', handleSlide, true);
        };
    }, []);

    const handleSlideTo = (index: number) => {
        const keenSlider = slider.current;
        if (!keenSlider) {
            return;
        }
        slider.current?.moveToIdx(index);
    };

    return (
        <div className={classNames(styles.root, className)}>
            <div
                ref={sliderRef}
                className={classNames('keen-slider', styles.slider)}
            >
                {children}
            </div>

            <StoriesNavigation
                total={children.length}
                onDotClick={handleSlideTo}
            />
        </div>
    );
}