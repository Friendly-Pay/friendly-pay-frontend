import { ArrowRight } from '../Icons/Arrow';
import { Image } from '../Image/Image';
import { Text } from '@/uikit';
import { formatApproximateSeconds } from '@/utils/date';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TopupCurrency.module.scss';

type TopupCurrencyProps = {
    name: string
    image: string
    network: string
    approximateSeconds: number
    className?: string
    onClick?: () => void
}

export function TopupCurrency({ name, image, network, approximateSeconds, className, onClick }: TopupCurrencyProps) {
    const [t] = useTranslation();
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
                    <Text
                        type='body'
                        align='left'
                        className={styles.name}
                    >
                        {name} {network}
                    </Text>

                    <Text
                        type='caption'
                        align='left'
                        className={styles.text}
                    >
                        {t('Top-up time')} <span>{formatApproximateSeconds(approximateSeconds, t)}</span>
                    </Text>
                </div>
            </div>

            <div className={styles.arrow}>
                <ArrowRight />
            </div>
        </div>
    );
}