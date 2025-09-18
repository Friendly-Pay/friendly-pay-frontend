import { CenteredContent } from './CenteredContent';
import { PaymentIcon } from './PaymentIcon';
import { CloseFill } from '@/components/Icons/Close';
import { useCardsStore } from '@/states/cards/store';
import { usePaymentStore } from '@/states/payment/store';
import { Spinner, Text } from '@/uikit';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './TransactionWaiting.module.scss';

type TransactionWaitingProps = {
    type: 'topup' | 'purchase' | 'bank-transfer'
    className?: string
}

export function TransactionWaiting({ type, children, className }: PropsWithChildren<TransactionWaitingProps>) {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const canGoHome = type === 'topup' || (type === 'purchase' && myCardsCount > 0) || type === 'bank-transfer';

    const handleBackHome = (e: any) => {
        e.preventDefault();

        if (type === 'topup') {
            navigate('/');
            const { userHiddenWaitingTopup } = usePaymentStore.getState();
            userHiddenWaitingTopup();
        } else if (type === 'purchase') {
            navigate('/');
            const { userHiddenWaitingCardPurchase } = usePaymentStore.getState();
            userHiddenWaitingCardPurchase();
        } else if (type === 'bank-transfer') {
            navigate('/bank-transfer');
        }
    };

    // @TODO Добавить текст: дольше чем обычно... вы точно отправили транзакцию?
    const headings: string[] = [
        t('Searching for your transaction...'),
        t('Waiting for confirmation...')
    ];

    const [headingIndex, setHeadingIndex] = useState(0);
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setHeadingIndex(prev => {
                if (prev < headings.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(intervalId);
                    return prev;
                }
            });
        }, 10_000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={classNames(styles.root, className)}>
            <div
                className={styles.close}
                onClick={handleBackHome}
            >
                <CloseFill />
            </div>

            <CenteredContent className={styles.content}>
                <div className={styles.top}>{children}</div>
                <PaymentIcon className={styles.icon}>
                    <Spinner className={styles.spin} />
                </PaymentIcon>
                <Text
                    type='headline'
                    align='center'
                    weight='semibold'
                    className={styles.title}
                >
                    {headings[headingIndex]}
                </Text>
                <Text
                    align='center'
                    weight='regular'
                    className={styles.text}
                >
                    {t('This will take ≈ {{minutes}} min. You can wait or close the window, we will send a notification', { minutes: 5 })}
                </Text>
                {canGoHome && <a
                    href='/'
                    className={styles.button}
                    onClick={handleBackHome}
                >{t('Back to home')}</a>}
            </CenteredContent>
        </div>
    );
}