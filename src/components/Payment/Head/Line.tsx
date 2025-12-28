import classNames from 'classnames';
import styles from './Line.module.scss';

type LineProps = {
    className?: string
}

export function Line({ className }: LineProps) {
    return (<div className={classNames(styles.line, className)} />);
}