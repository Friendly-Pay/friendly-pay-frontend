import { ArrowRight } from '@/components/Icons/Arrow';
import { Button, Text } from '@/uikit';
import storyImage from 'assets/stories/story_3.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './DigitalWalletStory.module.scss';

type DepositStoryProps = {
    onClick?: () => void
}

export function DigitalWalletStory({ onClick }: DepositStoryProps) {
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
                    {t('Add your card to Apple Pay or Google Wallet')}
                </Text>

                <Text
                    type='bodyLarge'
                    weight='medium'
                    align='left'
                    className={styles.text}
                >
                    {t('For contactless payments worldwide')}
                </Text>

                <div className={styles.imageWrap}>
                    <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${storyImage})` }}
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