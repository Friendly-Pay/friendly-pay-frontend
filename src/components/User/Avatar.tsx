import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.scss';

type AvatarProps = {
    src: string,
    className?: string
}

const loadedImagesCache = new Set<string>();

export function Avatar({ src, className }: AvatarProps) {
    const [loaded, setLoaded] = useState(loadedImagesCache.has(src));

    useEffect(() => {
        if (!loadedImagesCache.has(src)) {
            const timer = setTimeout(() => {
                loadedImagesCache.add(src);
            }, 300);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [loaded]);

    return (
        <div className={classNames(styles.root, className)}>
            <img
                src={src}
                alt='avatar'
                onLoad={() => setLoaded(true)}
                style={{
                    opacity: loaded || loadedImagesCache.has(src) ? 1 : 0,
                    transition: loadedImagesCache.has(src) ? undefined : 'opacity 0.15s ease-in-out',
                }}
            />
        </div>
    );
}