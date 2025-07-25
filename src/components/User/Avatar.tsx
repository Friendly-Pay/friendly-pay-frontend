import { useState } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.scss';

type AvatarProps = {
    src: string;
    className?: string;
    onClick?: () => void;
};

const loadedImagesCache = new Set<string>();

export function Avatar({ src, className, onClick }: AvatarProps) {
    const [loaded, setLoaded] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);

    const handleLoad = () => {
        setLoaded(true);
        loadedImagesCache.add(src);
        setTimeout(() => setShouldAnimate(false), 200);
    };

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
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