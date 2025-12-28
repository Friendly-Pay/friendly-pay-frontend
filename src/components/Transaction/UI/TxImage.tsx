import { ReactNode, useId } from 'react';
import classNames from 'classnames';
import styles from './TxImage.module.scss';

type TxImageProps = {
    size?: 48 | 80
    icon?: ReactNode
    image?: string
    iconColor?: string
    backgroundColor?: string
    className?: string
}

// const backgroundPath = 'M.8 12.3C1.7 6.3 6.2 1.7 12.3.8a83 83 0 0 1 23.4 0c6 .9 10.6 5.4 11.5 11.5a83 83 0 0 1 0 23.4 13.4 13.4 0 0 1-11.5 11.5 83 83 0 0 1-23.4 0A13.4 13.4 0 0 1 .8 35.7a83 83 0 0 1 0-23.4';
// const borderPath = 'M1.3 12.4C2 6.5 6.5 2 12.3 1.3a82 82 0 0 1 23.3 0c5.9.8 10.3 5.2 11.1 11a82 82 0 0 1 0 23.3 13 13 0 0 1-11 11.1 82 82 0 0 1-23.3 0 13 13 0 0 1-11.1-11 82 82 0 0 1 0-23.3';

const backgroundPath = 'M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z';
const borderPath = 'M0.5 24C0.5 11.0213 11.0213 0.5 24 0.5C36.9787 0.5 47.5 11.0213 47.5 24C47.5 36.9787 36.9787 47.5 24 47.5C11.0213 47.5 0.5 36.9787 0.5 24Z';

export function TxImage({ icon, image, size = 48, iconColor, backgroundColor, className }: TxImageProps) {
    const clipId = useId();
    const bigIcon = size === 80;

    return (
        <div
            className={classNames(styles.root, className)}
            style={{
                width: size,
                height: size
            }}
        >
            <div
                className={styles.content}
                style={{
                    width: size,
                    height: size
                }}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                >
                    <path
                        d={backgroundPath}
                        className={classNames(styles.background, image && styles.backgroundWithImage)}
                        fill={backgroundColor}
                    />
                    {image && (
                        <>
                            <defs>
                                <clipPath id={clipId}>
                                    <path d={backgroundPath} />
                                </clipPath>
                            </defs>
                            <image
                                href={image}
                                width="100%"
                                height="100%"
                                clipPath={`url(#${clipId})`}
                                preserveAspectRatio="xMidYMid slice"
                            />
                            <path
                                d={backgroundPath}
                                fill="none"
                            ></path>
                        </>
                    )}
                    <path
                        d={borderPath}
                        className={styles.stroke}
                    />
                </svg>

                {icon && <div
                    className={classNames(styles.icon, bigIcon && styles.bigIcon)}
                    style={{ color: iconColor }}
                >
                    {icon}
                </div>}
            </div>
        </div>
    );
}