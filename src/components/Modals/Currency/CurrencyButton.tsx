import { Text } from '@/uikit';
import classNames from 'classnames';
import styles from './CurrencyButton.module.scss';

type CurrencyButtonProps = {
    name: string
    image: string
    description: string
    className?: string
    onClick?: () => void
}

export function CurrencyButton({ name, image, description, className, onClick }: CurrencyButtonProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.icon}>
                <img
                    src={image}
                    alt=''
                />
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {name}
                </Text>

                <Text
                    type='caption'
                    align='left'
                    weight='medium'
                    className={styles.text}
                >
                    {description}
                </Text>
            </div>
        </div>
    );
}