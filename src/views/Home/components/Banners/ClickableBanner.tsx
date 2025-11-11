import { Text } from '@/uikit';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './ClickableBanner.module.scss';

type ClickableBannerProps = {
    title: string,
    text: string,
    image: string,
    className?: string,
    onClick?: () => void
}

export function ClickableBanner({ title, text, image, className, onClick }: PropsWithChildren<ClickableBannerProps>) {
    return (
        <div
            className={classNames(styles.banner, className)}
            onClick={onClick}
        >
            <img
                src={image}
                alt={title}
                className={styles.image}
            />

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {title}
                </Text>

                <Text
                    type='caption'
                    align='left'
                    className={styles.text}
                >
                    {text}
                </Text>
            </div>
        </div>
    );
}