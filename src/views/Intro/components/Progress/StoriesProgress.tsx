import classNames from 'classnames';
import styles from './StoriesProgress.module.scss';

type StoriesProgressProps = {
    count: number
    currentStoryIndex: number
}

export function StoriesProgress({ count, currentStoryIndex }: StoriesProgressProps) {
    const segments = new Array(count).fill(undefined);
    return (
        <div
            className={styles.root}
            style={{
                gridTemplateColumns: `repeat(${count}, 1fr)`
            }}
        >
            {segments.map((_, index) =>
                <div
                    key={index}
                    className={classNames(styles.line, index <= currentStoryIndex && styles.active)}
                />
            )}
        </div>
    );
}