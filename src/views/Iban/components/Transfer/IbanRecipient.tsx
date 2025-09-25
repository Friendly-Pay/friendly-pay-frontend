import { ArrowDown } from '@/components/Icons/Arrow';
import { RecipientBusiness, RecipientPrivate } from '@/components/Icons/Recipient';
import { TransferRecipientType, useIbanTransferStore } from '@/states/iban/transfer';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './IbanRecipient.module.scss';

type IbanRecipientProps = {
    recipientType: TransferRecipientType
    className?: string
}
export function IbanRecipient({ recipientType, className }: IbanRecipientProps) {
    const [t] = useTranslation();

    let icon: any;
    let text: string;
    if (recipientType === TransferRecipientType.Private) {
        icon = <RecipientPrivate />;
        text = t('Individual');
    } else {
        icon = <RecipientBusiness />;
        text = t('Business');
    }

    const onClick = () => {
        useIbanTransferStore.getState().openRecipientModal();
    };
    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div className={styles.recipient}>
                {icon}
            </div>
            <div className={styles.content}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.title}
                >
                    {text}
                </Text>
                <Text
                    type='caption'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Recipient')}
                </Text>
            </div>

            <div className={styles.arrow}>
                <ArrowDown />
            </div>
        </div>
    );
}