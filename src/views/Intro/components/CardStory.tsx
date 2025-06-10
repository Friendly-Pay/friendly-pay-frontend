import { Text } from '@/uikit';
import { Button } from '@/uikit/Button';
import cardImage from 'assets/stories/card.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './CardStory.module.scss';

type CardStoryProps = {
    onClick?: () => void
}

export function CardStory({ onClick }: CardStoryProps) {
    const [t] = useTranslation();
    return (
        <>
            <div className={styles.content}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${cardImage})` }}
                ></div>

                <Text
                    type='headlineExtraLarge'
                    align='left'
                    weight='bold'
                    className={styles.title}
                >
                    {t('Choose your crypto card')}
                </Text>

                <Text
                    type='body'
                    align='left'
                    className={styles.text}
                >
                    {t('Get your Flexi Card in just a few steps')}
                </Text>
            </div>

            <Button
                view='primarySecond'
                className={styles.button}
                onClick={onClick}
            >
                {t('Get your card')}
            </Button>
        </>
    );
}