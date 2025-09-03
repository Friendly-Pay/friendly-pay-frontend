import { OfferCard } from './OfferCard';
import { Text } from '@/uikit';
import image from 'assets/bonus/deposit.png';
import background from 'assets/bonus/deposit_background.png?inline';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './DepositOffer.module.scss';

type DepositOfferProps = {
    depositBonusPercent: number
    className?: string
}

export const BANNER_IMAGE = image;

export function DepositOffer({ depositBonusPercent, className }: DepositOfferProps) {
    const [t] = useTranslation();
    return (
        <OfferCard
            className={classNames(styles.deposit, className)}
            style={{ backgroundImage: `url(${background})` }}
        >
            <img
                src={image}
                alt=''
                className={styles.image}
            />

            <div className={styles.content}>
                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                    dangerouslySetInnerHTML={{ __html: t('{{percent}}% for each<br/> top-up', { percent: depositBonusPercent }) }}
                />

                <Text
                    type='title'
                    align='left'
                    weight='semibold'
                    className={styles.reward}
                >
                    {t('Instantly credited')}
                </Text>
            </div>
        </OfferCard>
    );
}