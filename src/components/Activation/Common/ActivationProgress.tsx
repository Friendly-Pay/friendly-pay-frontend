import { Text } from '@/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ActivationProgress.module.scss';

type ActivationProgressProps = {
    label: string
    icon: ReactNode
    text?: string
    textDanger?: boolean
    minutes?: number
    className?: string
}

export function ActivationProgress({ label, icon, text, minutes, textDanger, children, className }: PropsWithChildren<ActivationProgressProps>) {
    const [t] = useTranslation();

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.head}>
                <div className={styles.label}>
                    <div className={styles.icon}>{icon}</div>
                    <Text
                        type='captionSmall'
                        weight='semibold'
                        className={styles.text}
                    >
                        {label}
                    </Text>
                </div>
                {minutes && <Text
                    type='captionSmall'
                    weight='semibold'
                    className={styles.text}
                >
                    {t('≈ {{minutes}} min', { minutes })}
                </Text>}
            </div>

            {text && <Text
                type='body'
                weight='semibold'
                align='left'
                className={classNames(styles.title, textDanger && styles.danger)}
                dangerouslySetInnerHTML={{ __html: text }}
            />}

            {children}
        </div >
    );
}