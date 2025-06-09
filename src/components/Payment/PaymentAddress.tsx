// import { QrCode } from '../Icons/QrCode';
import { Input } from '@/uikit';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PaymentAddress.module.scss';

type PaymentAddressProps = {
    address: string
    text?: string
}

export function PaymentAddress({ address, children }: PropsWithChildren<PaymentAddressProps>) {
    const [t] = useTranslation();
    return (
        <>
            <div className={styles.root}>
                <div className={styles.content}>
                    <Input
                        value={address}
                        canCopy
                        readOnly
                        copiedToastText={t('Wallet copied')}
                    />

                    {/* TODO: qr */}
                    {/* <div className={styles.button}>
                    <QrCode />
                </div> */}
                </div>

                {children}
            </div>
        </>
    );
}