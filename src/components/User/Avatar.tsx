import { useState } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.scss';

type AvatarProps = {
    src: string;
    className?: string;
};

const loadedImagesCache = new Set<string>();

export function Avatar({ src, className }: AvatarProps) {
    const [loaded, setLoaded] = useState(loadedImagesCache.has(src));
    const [shouldAnimate, setShouldAnimate] = useState(!loadedImagesCache.has(src));

    const handleLoad = () => {
        setLoaded(true);
        loadedImagesCache.add(src);
        setTimeout(() => setShouldAnimate(false), 200);
    };

    return (
        <div className={classNames(styles.root, className)}>
            <img
                src={src}
                alt="avatar"
                onLoad={handleLoad}
                style={{
                    opacity: loaded ? 1 : 0,
                    transition: shouldAnimate ? 'opacity 0.15s ease-in-out' : undefined,
                }}
            />
        </div>
    );
}