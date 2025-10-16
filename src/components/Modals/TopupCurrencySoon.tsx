import { Image } from '../Image/Image';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './CurrencyItem.module.scss';

type TopupCurrencyProps = {
    name: string
    text: string
    image: string
    className?: string
}

export function TopupCurrencySoon({ name, image, text, className }: TopupCurrencyProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            style={{ cursor: 'default' }}
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
                        {name}
                    </Text>

                    <Text
                        type='caption'
                        align='left'
                        className={styles.text}
                    // style={{ color: '#37ABA6' }}
                    >
                        {text}
                    </Text>
                </div>
            </div>
        </div>
    );
}