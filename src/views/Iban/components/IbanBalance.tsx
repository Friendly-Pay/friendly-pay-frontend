import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useUserStore } from '@/states/user/store';
import { Text, TextBlur } from '@/uikit';
import { formatCurrency } from '@/utils';
import euro from 'assets/iban/eur.png?inline';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './IbanBalance.module.scss';

type IbanBalanceProps = {
    balance: number
    currency: string
    balanceOnHold: number // Средства в обработке
    balanceFrozen: number // Например, санкции
    balanceText?: string
    isActivated: boolean
    className?: string
}

export function IbanBalance({
    balance,
    currency,
    balanceOnHold,
    balanceFrozen,
    balanceText,
    isActivated,
    className
}: IbanBalanceProps) {
    const [t] = useTranslation();
    const blurBalance = useUserStore(state => state.blurBalance);
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = useFormattedCurrencyParts(balance, currency || 'eur', languageCode);

    const tapCountRef = useRef(0);
    const tapTimeoutRef = useRef<any>(null);
    const handleBalanceTap = () => {
        if (!isActivated) return;
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }
        tapCountRef.current += 1;
        if (tapCountRef.current === 3) {
            useUserStore.getState().setBlurBalance(!blurBalance);
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            tapCountRef.current = 0;
            return;
        }
        tapTimeoutRef.current = setTimeout(() => {
            tapCountRef.current = 0;
        }, 300);
    };

    useEffect(() => {
        return () => {
            if (tapTimeoutRef.current) {
                clearTimeout(tapTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className={classNames(styles.root, blurBalance && styles.blur, className)}
            onClick={handleBalanceTap}
        >
            <div className={styles.head}>
                <div className={styles.euro}>
                    <img
                        src={euro}
                        alt=''
                        className={styles.eurImage}
                    />
                </div>
            </div>

            <div className={styles.content}>
                <Text
                    type='body'
                    weight='regular'
                    align='left'
                    className={styles.text}
                >
                    {t('EUR Account')}
                </Text>

                <div className={classNames(styles.balance, !isActivated && styles.pendingIban)}>
                    {isActivated ? (
                        blurBalance ? (
                            <TextBlur
                                rows={3}
                                cell={38 / 3}
                                className={styles.balanceBlur}
                            />
                        ) : (
                            formattedCurrencyParts.map((part, index) => (
                                <span
                                    key={index}
                                    className={styles[part.type]}
                                >
                                    {part.value}
                                </span>
                            ))
                        )
                    ) : balanceText && (
                        <div dangerouslySetInnerHTML={{ __html: balanceText }}></div>
                    )}
                </div>

                {isActivated && (balanceOnHold > 0 || balanceFrozen > 0) && (
                    <div className={styles.amounts}>
                        {balanceOnHold > 0 && (
                            <Text
                                type='caption'
                                className={styles.amount}
                            >
                                {t('On hold')} {formatCurrency(balanceOnHold, currency, languageCode)}
                            </Text>
                        )}
                        {balanceFrozen > 0 && (
                            <Text
                                type='caption'
                                className={styles.amount}
                            >
                                {t('Frozen')} {formatCurrency(balanceFrozen, currency, languageCode)}
                            </Text>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}