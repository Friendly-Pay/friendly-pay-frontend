import { SumsubContext } from '../context';
import { Image } from '@/components/Image/Image';
import { Spinner, Text } from '@/uikit';
import { useContext } from 'react';
import styles from './SumsubScreen.module.scss';

export function SumsubPending() {
    const { texts, icons } = useContext(SumsubContext);

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.head}>
                    <div className={styles.icon}>
                        <Image
                            src={icons.pending!}
                            alt=''
                        />
                    </div>
                </div>

                <div className={styles.info}>
                    <Text
                        type='headline'
                        weight='semibold'
                        align='center'
                        className={styles.title}
                    >
                        {texts.pendingTitle}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                    >
                        {texts.pendingDescription}
                    </Text>
                </div>
            </div>

            <div className={styles.buttons}>
                <div className={styles.loaderWrap}>
                    <Spinner className={styles.spinner} />
                </div>
            </div>
        </div>
    );
}