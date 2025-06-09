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
                    {t('Get your Friendly Pay card in just a few steps')}
                </Text>
            </div>

            <div
                className={styles.image}
                style={{ backgroundImage: `url(${cardImage})` }}
            ></div>

            <Button
                view='white'
                className={styles.button}
                onClick={onClick}
            >
                {t('Get your card')}
            </Button>
        </>
    );
}