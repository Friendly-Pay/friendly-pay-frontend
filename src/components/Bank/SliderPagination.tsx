import classNames from 'classnames';
import styles from './SliderPagination.module.scss';

type SliderPaginationProps = {
    total: number;
    activeIndex: number;
    className?: string;
    onClick?: (index: number) => void;
}

export function SliderPagination({ total, activeIndex, className, onClick }: SliderPaginationProps) {
    return (
        <div className={classNames(styles.root, className)}>
            {Array.from({ length: total }).map((_, index) => {
                const handleClick = () => {
                    onClick?.(index);
                };

                return (
                    <div
                        key={index}
                        className={classNames(styles.dot, activeIndex === index && styles.active)}
                        onClick={handleClick}
                    />
                );
            })}
        </div>
    );
}