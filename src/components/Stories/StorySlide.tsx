import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './StorySlide.module.scss';

type StorySlideProps = {
    children: ReactNode
    className?: string
}

export function StorySlide({ children, className }: StorySlideProps) {
    return (
        <div className={classNames('keen-slider__slide', styles.slide, className)} >
            {children}
        </div>
    );
}