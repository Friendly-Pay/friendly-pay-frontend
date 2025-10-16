import { ArrowRight } from '../Icons/Arrow';
import { Image } from '../Image/Image';
import classNames from 'classnames';
import styles from './CurrencyItem.module.scss';

type CurrencyItemProps = {
    name: string
    image: string
    network: string
    className?: string
    onClick?: () => void
}

export function CurrencyItem({ name, image, network, className, onClick }: CurrencyItemProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.content}>
                <Image
                    src={image}
                    alt={name}
                    className={styles.image}
                />

                <div className={styles.data}>
                    <div className={styles.name}>
                        {name} {network}
                    </div>
                </div>
            </div>

            <div className={styles.arrow}>
                <ArrowRight />
            </div>
        </div>
    );
}