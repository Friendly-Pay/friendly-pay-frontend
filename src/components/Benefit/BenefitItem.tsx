import { Text } from '@/uikit';
import { PropsWithChildren } from 'react';
import styles from './BenefitItem.module.scss';

type BenefitItemProps = {
    title: string
    text: string
}

export function BenefitItem({ title, text, children }: PropsWithChildren<BenefitItemProps>) {
    return (
        <div className={styles.item}>
            <div className={styles.prefix}>
                {children}
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='semibold'
                >
                    {title}
                </Text>

                <Text
                    type='caption'
                    align='left'
                    className={styles.text}
                >
                    {text}
                </Text>
            </div>
        </div>
    );
}