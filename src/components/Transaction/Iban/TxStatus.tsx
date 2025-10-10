
import { ClockFill } from '@/components/Icons/Clock';
import { IbanTransactionStatus, IbanTransactionType } from '@/states/iban/store';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TxStatus.module.scss';

type TxStatusProps = {
    type: IbanTransactionType
    status: IbanTransactionStatus
    className?: string
}

export function TxStatus({ type, status, className }: TxStatusProps) {
    const [t] = useTranslation();

    // Определяем группы статусов
    const inProgressStatuses = [
        'NEW', 'PENDING', 'PENDING_EXTERNALLY', 'PENDING_FX',
        'APPROVAL', 'EMAIL_APPROVAL', 'LEGAL_APPROVAL', 'LEGAL_APPROVED',
        'APPROVED', 'APPROVED_BY_RISK_MANAGER', 'APPROVED_BY_COMPLIANCE_MANAGER'
    ];

    const errorStatuses = [
        'REJECTED', 'CANCELED', 'ERROR', 'FAILED', 'REVERTED'
    ];

    const successStatuses = ['COMPLETED'];

    const statusClassName = classNames(styles.status, {
        [styles.danger]: errorStatuses.includes(status),
        [styles.success]: successStatuses.includes(status),
        [styles.inProgress]: inProgressStatuses.includes(status)
    }, className);

    let statusText: any = null;

    if (inProgressStatuses.includes(status)) {
        statusText = (
            <Text
                type='caption'
                weight='regular'
                align='right'
                className={statusClassName}
            >
                <div className={styles.icon}><ClockFill /></div>
                <div>{t('Processing')}</div>
            </Text>
        );
    } else if (errorStatuses.includes(status)) {
        let errorMessage = '';
        if (type === 'DEPOSIT') {
            errorMessage = t('Deposit error');
        }
        else if (type === 'PAYMENT') {
            errorMessage = t('Authorization error');
        }

        statusText = (
            <Text
                type='caption'
                weight='regular'
                align='right'
                className={statusClassName}
            >
                {errorMessage}
            </Text>
        );
    }

    return statusText;
}