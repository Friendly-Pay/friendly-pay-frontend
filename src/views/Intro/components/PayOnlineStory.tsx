import { Button, Text } from '@/uikit';
import storyImage from 'assets/stories/story_4.png?inline';
import { useTranslation } from 'react-i18next';
import styles from './PayOnlineStory.module.scss';

type DepositStoryProps = {
    onClick?: () => void
}

export function PayOnlineStory({ onClick }: DepositStoryProps) {
    const [t] = useTranslation();
    return (
        <>
            <div className={styles.content}>
                <Text
                    type='headlineExtraLarge'
                    align='left'
                    weight='bold'
                    className={styles.title}
                    dangerouslySetInnerHTML={{ __html: t('Pay for online services or make transactions up to <span>$1,000,000</span>') }}
                />

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
                {t('Get started')}
            </Button>
        </>
    );
}