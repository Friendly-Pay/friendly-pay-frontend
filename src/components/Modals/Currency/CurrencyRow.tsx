import { ArrowRight } from '@/components/Icons/Arrow';
import { Image } from '@/components/Image/Image';
import classNames from 'classnames';
import styles from './CurrencyRow.module.scss';

type CurrencyRowProps = {
    name: string
    image: string
    network: string
    className?: string
    onClick?: () => void
}

export function CurrencyRow({ name, image, network, className, onClick }: CurrencyRowProps) {
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