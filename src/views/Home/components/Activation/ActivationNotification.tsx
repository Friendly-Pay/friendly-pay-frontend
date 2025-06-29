import { ActivationClock } from '@/components/Icons/Clock';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ActivationNotification.module.scss';

type ActivationNotificationProps = {
    className?: string
}

export function ActivationNotification({ className }: ActivationNotificationProps) {
    const [t] = useTranslation();
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Card is being activated...')}
                </Text>

                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('This will take approximately 15 minutes.')}
                </Text>
            </div>

            <div className={styles.icon}>
                <ActivationClock />
            </div>
        </div>
    );
}