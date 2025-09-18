import { BankTransferMethod } from '../state/types';
import { Bank } from './Icons/Bank';
import { Globe } from './Icons/Globe';
import { Text } from '@/uikit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TransferMethodButton.module.scss';

type TransferMethodButtonProps = {
    method: BankTransferMethod
    className?: string
    onClick?: () => void
}

export function TransferMethodButton({ method, className, onClick }: TransferMethodButtonProps) {
    const [t] = useTranslation();

    let icon: any = null;
    let text: any = null;
    switch (method) {
        case BankTransferMethod.BankTransfer:
            icon = <Bank />;
            text = t('Bank<br/> transfer');
            break;
        case BankTransferMethod.GlobalBankTransfer:
            icon = <Globe />;
            text = t('Bank transfer<br />SWIFT');
            break;
    }

    return (
        <div
            className={classNames(styles.root, className)}
            onClick={onClick}
        >
            <div
                className={styles.icon}
                style={{
                    backgroundColor: method === BankTransferMethod.BankTransfer
                        ? 'var(--color-bank-transfer-transaction)'
                        : 'var(--color-bank-transfer-transaction-global)'
                }}
            >
                {icon}
            </div>

            <div className={styles.content}>
                <Text
                    type='caption'
                    align="center"
                    weight="regular"
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </div>
        </div>
    );
}