import { Image } from '@/components/Image/Image';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TopupCurrency.module.scss';

type TopupCurrencyProps = {
    name: string,
    network: string,
    image: string,
    className?: string
}

export function TopupCurrency({ name, network, image, className }: TopupCurrencyProps) {
    const [t] = useTranslation();

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.currencyIcon}>
                <Image
                    src={image}
                    alt=''
                />
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    {name} {network}
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                >
                    {t('Top-up currency')}
                </Text>
            </div>
        </div>
    );
}