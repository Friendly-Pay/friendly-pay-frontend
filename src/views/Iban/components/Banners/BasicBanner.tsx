import { Text } from '@/uikit';
import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './BasicBanner.module.scss';

type BasicBannerProps = {
    image: string
    style?: CSSProperties
    className?: string
}

export function BasicBanner({ image, children, style, className }: PropsWithChildren<BasicBannerProps>) {
    return (
        <div
            className={classNames(styles.banner, className)}
            style={style}
        >
            <div
                className={styles.image}
                style={{ backgroundImage: `url(${image})` }}
            ></div>
            <Text
                type='body'
                weight='medium'
                align='center'
                className={styles.title}
            >
                {children}
            </Text>
        </div>
    );
}