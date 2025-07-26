import { ClockFill } from '../Icons/Clock';
import { CardTransactionStatus, CardTransactionType } from '@/states/cards/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TxStatus.module.scss';

type TxStatusProps = {
    type: CardTransactionType
    status: CardTransactionStatus
    className?: string
}

export function TxStatus({ type, status, className }: TxStatusProps) {
    const [t] = useTranslation();
    const statusClassName = classNames(styles.status, {
        [styles.danger]: status === CardTransactionStatus.FAILED
    }, className);

    let statusText: any = null;
    if (status === CardTransactionStatus.IN_PROGRESS) {
        statusText = <Text
            type='caption'
            weight='regular'
            align='right'
            className={statusClassName}
        ><div className={styles.icon}><ClockFill /></div><div>{t('Processing')}</div></Text>;
    } else if (status === CardTransactionStatus.FAILED) {
        if (type === CardTransactionType.DEPOSIT) {
            statusText = <Text
                type='caption'
                weight='regular'
                align='right'
                className={statusClassName}
            >{t('Deposit error')}</Text>;
        } else if (type === CardTransactionType.PAYMENT) {
            statusText = <Text
                type='caption'
                weight='regular'
                align='right'
                className={statusClassName}
            >{t('Authorization error')}</Text>;
        }
    }

    return statusText;
}