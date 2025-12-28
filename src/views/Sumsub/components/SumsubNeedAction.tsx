import { SumsubContext } from '../context';
import { Image } from '@/components/Image/Image';
import { Button, Text } from '@/uikit';
import { FetchStatus } from '@/utils/api';
import { useContext } from 'react';
import styles from './SumsubScreen.module.scss';

export function SumsubNeedAction() {
    const {
        texts,
        icons,
        sumsubLinkFetchStatus,
        handleKycStart
    } = useContext(SumsubContext);

    const processing = sumsubLinkFetchStatus === FetchStatus.Pending;
    const failed = sumsubLinkFetchStatus === FetchStatus.Rejected;

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.head}>
                    <div className={styles.icon}>
                        <Image
                            src={icons.needAction!}
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
                        {texts.needActionTitle}
                    </Text>

                    <Text
                        type='body'
                        weight='regular'
                        align='center'
                        className={styles.text}
                    >
                        {texts.needActionDescription}
                    </Text>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button
                    view='primary'
                    loading={processing}
                    disabled={failed}
                    className={styles.button}
                    onClick={handleKycStart}
                >
                    {texts.needActionButton}
                </Button>
            </div>
        </div>
    );
}