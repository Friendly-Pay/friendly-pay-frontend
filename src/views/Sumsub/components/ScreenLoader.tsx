import { Spinner } from '@/uikit';
import classNames from 'classnames';
import styles from './ScreenLoader.module.scss';

type ScreenLoaderProps = {
    visible: boolean
    className?: string
}

export function ScreenLoader({ visible, className }: ScreenLoaderProps) {
    return (
        <div className={classNames(styles.loader, visible && styles.visible, className)}>
            <Spinner className={styles.spinner} />
        </div>
    );
}