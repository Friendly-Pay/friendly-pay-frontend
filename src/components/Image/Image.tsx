import { useState } from 'react';
import classNames from 'classnames';
import styles from './Image.module.scss';

type ImageProps = {
    src: string
    alt?: string
    loading?: 'lazy'
    className?: string
}

export function Image({ src, alt, loading, className }: ImageProps) {
    const [loaded, setLoaded] = useState(false);
    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            className={classNames(styles.image, className)}
            onLoad={() => setLoaded(true)}
            style={{
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.2s',
            }}
        />
    );
}