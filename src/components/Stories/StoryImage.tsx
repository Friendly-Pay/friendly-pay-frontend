import classNames from 'classnames';
import styles from './StoryImage.module.scss';

type StoryImageProps = {
    src: string;
    className?: string;
}

export function StoryImage({ src, className }: StoryImageProps) {
    const objectPosition = 'bottom center';

    return (
        <div className={styles.imageWrap}>
            <img
                src={src}
                alt=''
                className={classNames(styles.image, className)}
                style={{ objectPosition }}
            />
        </div>
    );
}