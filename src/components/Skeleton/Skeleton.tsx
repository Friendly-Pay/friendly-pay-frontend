import { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './Skeleton.module.scss';

type SkeletonProps = {
    className?: string
    style?: CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
    return <div
        className={classNames(styles.skeleton, className)}
        style={style}
    ></div>;
}