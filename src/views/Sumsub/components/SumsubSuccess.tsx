import { SumsubContext } from '../context';
import { Image } from '@/components/Image/Image';
import { Button, Text } from '@/uikit';
import { useContext } from 'react';
import styles from './SumsubScreen.module.scss';

export function SumsubSuccess() {
    const {
        texts,
        icons,
        handleOpenCardPurchase
    } = useContext(SumsubContext);

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.head}>
                    <div className={styles.icon}>
                        <Image
                            src={icons.success!}
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
                        {texts.successTitle}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                        dangerouslySetInnerHTML={{ __html: texts.successDescription! }}
                    />
                </div>
            </div>

            <div className={styles.buttons}>
                <Button
                    view='primary'
                    className={styles.button}
                    onClick={handleOpenCardPurchase}
                >
                    {texts.successButton}
                </Button>
            </div>
        </div>
    );
}