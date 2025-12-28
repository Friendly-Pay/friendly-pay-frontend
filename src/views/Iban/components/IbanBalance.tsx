import { IbanHead } from './IbanHead';
import { useFormattedCurrencyParts } from '@/hooks/useFormattedCurrencyParts';
import { useUserStore } from '@/states/user/store';
import { Text, TextBlur } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './IbanBalance.module.scss';

type IbanBalanceProps = {
    balance: number
    currency: string
    balanceOnHold: number // Средства в обработке
    balanceFrozen: number // Например, санкции
    className?: string
}

export function IbanBalance({
    balance,
    currency,
    balanceOnHold,
    balanceFrozen,
    className
}: IbanBalanceProps) {
    const [t] = useTranslation();
    const blurBalance = useUserStore(state => state.blurBalance);
    const languageCode = useUserStore(state => state.languageCode);

    const getHoldAmount = () => Math.abs(balanceOnHold);
    const getFrozenAmount = () => Math.abs(balanceFrozen);
    const getAvailableBalance = () => balance - getHoldAmount() - getFrozenAmount();

    const holdAmount = getHoldAmount();
    const frozenAmount = getFrozenAmount();
    const availableBalance = getAvailableBalance();
    const hasAdditionalAmounts = holdAmount > 0 || frozenAmount > 0;

    const formattedCurrencyParts = useFormattedCurrencyParts(
        availableBalance,
        currency || 'eur',
        languageCode
    );

    const tapCountRef = useRef(0);
    const tapTimeoutRef = useRef<any>(null);
    const handleBalanceTap = () => {
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

    const renderBalanceContent = () => {
        if (blurBalance) {
            return (
                <TextBlur
                    rows={3}
                    cell={38 / 3}
                    className={styles.balanceBlur}
                />
            );
        }

        return formattedCurrencyParts.map((part, index) => (
            <span
                key={index}
                className={styles[part.type]}
            >
                {part.value}
            </span>
        ));
    };

    const renderAdditionalAmounts = () => {
        if (!hasAdditionalAmounts) return null;

        return (
            <div className={styles.amounts}>
                {holdAmount > 0 && (
                    <Text
                        type='caption'
                        className={styles.amount}
                    >
                        {t('On hold')} {formatCurrency(holdAmount, currency, languageCode)}
                    </Text>
                )}
                {frozenAmount > 0 && (
                    <Text
                        type='caption'
                        className={styles.amount}
                    >
                        {t('Frozen')} {formatCurrency(frozenAmount, currency, languageCode)}
                    </Text>
                )}
            </div>
        );
    };

    return (
        <div
            className={classNames(styles.root, blurBalance && styles.blur, className)}
            onClick={handleBalanceTap}
        >
            <IbanHead />

            <div className={styles.content}>
                <Text
                    type='body'
                    weight='regular'
                    align='left'
                    className={styles.text}
                >
                    {t('EUR Account')}
                </Text>

                <div className={styles.balance}>
                    {renderBalanceContent()}
                </div>

                {renderAdditionalAmounts()}
            </div>
        </div>
    );
}