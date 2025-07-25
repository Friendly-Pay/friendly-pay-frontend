import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useUserStore } from '@/states/user/store';
import { TextBlur } from '@/uikit';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardBalanceFixed.module.scss';

type CardBalanceFixedProps = {
    value: string | number
    currency: string
    loadCompleted?: boolean
}

export function CardBalanceFixed({ value, currency }: CardBalanceFixedProps) {
    const [t] = useTranslation();
    const blurBalance = useUserStore(state => state.blurBalance);
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(value, currency, languageCode);

    const [visible, setVisible] = useState(false);
    const balanceTriggered = useRef<boolean>(false);
    useLayoutEffect(() => {
        const balance = document.getElementById('balance');
        const pageHead = document.getElementById('pageHead');
        const mainLayout = document.getElementById('mainLayout');
        if (!balance || !pageHead || !mainLayout) {
            return;
        }

        const headRect = pageHead.getBoundingClientRect();
        const computeVisible = () => {
            const balanceRect = balance.getBoundingClientRect();
            if (!balanceTriggered.current && headRect.bottom >= balanceRect.bottom) {
                setVisible(true);
                balanceTriggered.current = true;
            } else if (balanceTriggered.current && balanceRect.bottom > headRect.bottom) {
                setVisible(false);
                balanceTriggered.current = false;
            }
        };

        computeVisible();
        mainLayout.addEventListener('scroll', computeVisible, { passive: true });
        return () => {
            mainLayout.removeEventListener('scroll', computeVisible);
        };
    }, []);

    return (
        <div className={classNames(styles.root, visible && styles.visible, blurBalance && styles.blur)}>
            <div className={styles.text}>{t('Balance')}</div>
            <div className={styles.balance}>
                {blurBalance
                    ? <TextBlur
                        cell={6}
                        rows={2}
                        className={styles.blurSvg}
                    />
                    : formattedCurrencyParts.map((part, index) => (
                        <span
                            key={index}
                            className={styles[part.type]}
                        >
                            {part.value}
                        </span>
                    ))}
            </div>
        </div>
    );
}