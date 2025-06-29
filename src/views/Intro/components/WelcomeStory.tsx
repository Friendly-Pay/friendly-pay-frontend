import { ArrowRight } from '@/components/Icons/Arrow';
import { Text } from '@/uikit';
import { Button } from '@/uikit/Button';
import welcomeImage from 'assets/stories/story_1.png?inline';
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
                <Text
                    type='headlineExtraLarge'
                    align='left'
                    weight='bold'
                    className={styles.title}
                >
                    {t('Welcome to ARBI Wallet')}
                </Text>

                <Text
                    type='bodyLarge'
                    weight='medium'
                    align='left'
                    className={styles.text}
                >
                    {t('Create your virtual card and pay for anything worldwide')}
                </Text>

                <div className={styles.imageWrap}>
                    <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${welcomeImage})` }}
                    ></div>
                </div>
            </div>

            <Button
                view='white'
                className={styles.button}
                onClick={onClick}
            >
                <ArrowRight />
            </Button>
        </>
    );
}