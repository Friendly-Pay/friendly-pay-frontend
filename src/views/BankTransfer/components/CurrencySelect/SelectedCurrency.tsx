import { ArrowDown } from '@/components/Icons/Arrow';
import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './SelectedCurrency.module.scss';

type SelectedCurrencyProps = {
    name: string
    image: string
    asEmoji?: boolean
    clickable?: boolean
    className?: string
    onClick?: () => void
}

export function SelectedCurrency({ name, image, asEmoji, clickable, className, onClick }: SelectedCurrencyProps) {
    let currencyImage: any;
    if (asEmoji) {
        currencyImage = <div className={styles.emoji}>{image}</div>;
    } else {
        currencyImage = <img
            src={image}
            alt=''
        />;
    }

    return (
        <div
            className={classNames(styles.root, clickable && styles.clickable, className)}
            onClick={onClick}
        >
            <div className={styles.content}>
                <div className={styles.image}>
                    {currencyImage}
                </div>
                <Text
                    type='body'
                    align='left'
                    weight='medium'
                >
                    {name}
                </Text>
                {clickable && <div className={styles.arrow}>
                    <ArrowDown />
                </div>}
            </div>
        </div>
    );
}