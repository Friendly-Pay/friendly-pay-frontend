import { Text } from '@/uikit';
import { Button } from '@/uikit/Button';
import welcomeImage from 'assets/stories/welcome.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './WelcomeStory.module.scss';

type WelcomeStoryProps = {
    onClick?: () => void
}

export function WelcomeStory({ onClick }: WelcomeStoryProps) {
    const [t] = useTranslation();
    return (
        <>
            <div className={styles.content}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${welcomeImage})` }}
                ></div>

                <Text
                    type='headlineExtraLarge'
                    align='left'
                    weight='bold'
                    className={styles.title}
                >
                    {t('Welcome to Flexi Cards!')}
                </Text>

                <Text
                    type='body'
                    align='left'
                    className={styles.text}
                >
                    {t('Crypto cards for payment and cash withdrawal worldwide')}
                </Text>
            </div>

            <Button
                view='primarySecond'
                className={styles.button}
                onClick={onClick}
            >
                {t('Next')}
            </Button>
        </>
    );
}