import { OfferCard } from './OfferCard';
import { Text } from '@/uikit';
import image from 'assets/bonus/deposit.png';
import classNames from 'classnames';
import styles from './DepositOffer.module.scss';

type DepositOfferProps = {
    depositBonusPercent: number
    className?: string
}

export const BANNER_IMAGE = image;

export function DepositOffer({ depositBonusPercent, className }: DepositOfferProps) {
    return (
        <OfferCard className={classNames(styles.deposit, className)}>
            <div
                className={styles.image}
                style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
            ></div>

            <div className={styles.content}>
                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {depositBonusPercent}% за каждое<br /> пополнение
                </Text>

                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                    className={styles.reward}
                >
                    Начисляем моментально
                </Text>
            </div>
        </OfferCard>
    );
}