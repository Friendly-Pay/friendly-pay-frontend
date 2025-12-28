import { CenteredContent } from '../Layout/CenteredContent';
import { useCardsStore } from '@/states/cards/store';
import { Spinner, Text } from '@/uikit';
import { useEffect, useState } from 'react';
import styles from './TransactionWaiting.module.scss';

type TransactionWaitingProps = {
    texts: TransactionWaitingTexts
    className?: string
    onClose: () => void
}

export interface TransactionWaitingTexts {
    head: string,
    title: string[],
    description: string,
    button: string
}

export function TransactionWaiting({ texts, className, onClose }: TransactionWaitingProps) {
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const canGoHome = myCardsCount > 0;

    const handleBackHome = (e: any) => {
        e.preventDefault();
        onClose();
    };

    const [titleIndex, setTitleIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setTitleIndex(prev => {
                if (prev < texts.title.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(intervalId);
                    return prev;
                }
            });
        }, 10_000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <CenteredContent className={className}>
            <div className={styles.top}>
                <Text
                    type='caption'
                    align='center'
                    weight='medium'
                    dangerouslySetInnerHTML={{ __html: texts.head }}
                />
            </div>

            <div className={styles.iconWrap}>
                <div className={styles.icon}>
                    <Spinner className={styles.spin} />
                </div>
            </div>

            <Text
                type='headline'
                align='center'
                weight='semibold'
                className={styles.title}
            >
                {texts.title[titleIndex]}
            </Text>
            <Text
                align='center'
                weight='regular'
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: texts.description }}
            />

            {canGoHome && <a
                href='/'
                className={styles.button}
                onClick={handleBackHome}
            > {texts.button}</a>}
        </CenteredContent>
    );
}