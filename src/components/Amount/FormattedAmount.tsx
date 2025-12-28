import { useCurrency } from '@/states/currency/hooks';
import { useUserStore } from '@/states/user/store';
import { formatAmount } from '@/utils/format';
import { useMemo } from 'react';
import classNames from 'classnames';
import styles from './FormattedAmount.module.scss';

type FormattedAmountProps = {
    /** Значение */
    value: number | null

    /** Валюта */
    currency?: string

    /** Максимальное число знаков до запятой */
    minority?: number

    /** Знак позитивной суммы */
    positiveSymbol?: 'plus',

    /** Класс css */
    className?: string
    majorPartClassName?: string;
    minorPartClassName?: string;
    currencyClassName?: string;
    currencySeparatorClassName?: string;
    positiveSymbolClassName?: string;
}

export function FormattedAmount({
    value,
    currency,
    minority,
    positiveSymbol,
    className,
    majorPartClassName,
    minorPartClassName,
    currencyClassName,
    currencySeparatorClassName,
    positiveSymbolClassName,
}: FormattedAmountProps) {
    const locale = useUserStore(state => state.languageCode);

    const currencyData = useCurrency(currency);
    const currencyMinority = minority || currencyData?.minorUnits || 0;

    const formatted = useMemo(() => {
        return formatAmount({
            value,
            currency,
            minority: currencyMinority,
            view: 'default',
            locale
        });
    }, [value, currency, currencyMinority, locale]);

    return (
        <div className={classNames(styles.amount, className)}>
            {positiveSymbol === 'plus' && <span className={classNames(styles.positiveSymbol, positiveSymbolClassName)}>+</span>}

            {/* Валюта перед числом (для префиксного формата) */}
            {formatted.currencyPosition === 'prefix' && formatted.currencySymbol && (
                <>
                    <span className={classNames(styles.currency, currencyClassName)}>{formatted.currencySymbol}</span>
                    {formatted.currencySeparator && (
                        <span className={classNames(styles.currencySeparator, currencySeparatorClassName)}>
                            {formatted.currencySeparator}
                        </span>
                    )}
                </>
            )}

            {/* Целая часть числа с разделителями тысяч */}
            <span className={classNames(styles.majorPart, majorPartClassName)}>
                {formatted.majorPart}
            </span>

            {/* Дробная часть (если есть) */}
            {formatted.minorPart && (
                <span className={classNames(styles.mimorPart, minorPartClassName)}>
                    {formatted.decimalsSeparator}
                    {formatted.minorPart}
                </span>
            )}

            {/* Валюта после числа (для суффиксного формата) */}
            {formatted.currencyPosition === 'suffix' && formatted.currencySymbol && (
                <>
                    {formatted.currencySeparator && (
                        <span className={classNames(styles.currencySeparator, currencySeparatorClassName)}>
                            {formatted.currencySeparator}
                        </span>
                    )}
                    <span className={classNames(styles.currency, currencyClassName)}>{formatted.currencySymbol}</span>
                </>
            )}
        </div>
    );
}