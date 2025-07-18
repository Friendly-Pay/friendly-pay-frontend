import classNames from 'classnames';
import styles from './TmaSettings.module.scss';

type TmaSettingsProps = {
    className?: string
}

export function TmaSettings({ className }: TmaSettingsProps) {
    return (
        <div className={classNames(styles.root, className)}>
            .
        </div>
    );
}