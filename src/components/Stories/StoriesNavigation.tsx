import { useStoriesStore } from './store';
import classNames from 'classnames';
import styles from './StoriesNavigation.module.scss';

type StoriesNavigationProps = {
    total: number;
    className?: string;
    onDotClick?: (index: number) => void
}

export function StoriesNavigation({ total, className, onDotClick }: StoriesNavigationProps) {
    const activeIndex = useStoriesStore(state => state.activeIndex);

    if (total <= 1) {
        return null;
    }

    return (
        <div className={classNames(styles.nav, className)}>
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={index}
                    className={classNames(styles.dot, {
                        [styles.active]: index === activeIndex,
                    })}
                    onClick={() => onDotClick?.(index)}
                />
            ))}
        </div>
    );
}