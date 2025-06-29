import { ArrowRight } from '@/components/Icons/Arrow';
import { Button, Text } from '@/uikit';
import storyImage from 'assets/stories/story_2.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './DepositStory.module.scss';

type DepositStoryProps = {
    onClick?: () => void
}

export function DepositStory({ onClick }: DepositStoryProps) {
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
                    {t('Top up your card balance online right in the app')}
                </Text>

                <Text
                    type='bodyLarge'
                    weight='medium'
                    align='left'
                    className={styles.text}
                >
                    {t('Via crypto wallet or by exchanging from other currencies')}
                </Text>

                <div className={styles.imageWrap}>

                    <div
                        className={styles.image}
                        style={{ backgroundImage: `url(${storyImage})` }}
                    ></div>
                </div>
            </div>

            <Button
                view='green'
                className={styles.button}
                onClick={onClick}
            >
                <ArrowRight />
            </Button>
        </>
    );
}