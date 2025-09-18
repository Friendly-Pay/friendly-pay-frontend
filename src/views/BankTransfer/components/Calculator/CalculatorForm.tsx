import { useBankTransferCurrenciesStore } from '../../state/currencies';
import { useBankTransferRequiredFields } from '../../state/fields';
import { CalculatorField, useBankTransferStore } from '../../state/store';
import { BankTransferCurrency, BankTransferMethod } from '../../state/types';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';
import { SelectedCurrency } from '../CurrencySelect/SelectedCurrency';
import { CalcInput } from './CalcInput';
import { CalcProperty } from './CalcProperty';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { usePaymentStore } from '@/states/payment/store';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './CalculatorForm.module.scss';

type CalculatorFormProps = {
    className?: string
}

const toNumberStrict = (s: string): number | null => {
    if (!s || !s.trim()) return null;
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
};
const round2 = (n: number) => Math.round(n * 100) / 100;
const toStr2 = (n: number | null | undefined) => {
    if (n == null || !Number.isFinite(n)) return '';
    const fixed = round2(n).toFixed(2);
    return fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};

/**
 * @TODO нужен рефактор для чтобы не дублировать логику в транзакция и тут
 * ```
 *  let exchangeRate: string = '';
    if (calculation.exchangeRate && Number.isFinite(calculation.exchangeRate)) {
        exchangeRate = `1 USD = ${formatCurrency(calculation.exchangeRate, outputCurrency.currency, locale, 2)} ${outputCurrency.currency}`;
    }
    ```
 */
export function CalculatorForm({ className }: CalculatorFormProps) {
    const [t] = useTranslation();
    const locale = useUserStore(state => state.languageCode);
    const field = useBankTransferStore(state => state.calculator.field);
    const method = useBankTransferStore(state => state.selectedMethod!);
    const typedValue = useBankTransferStore(state => state.calculator.typedValue);
    const hasUserTypedRef = useRef(false);
    useEffect(() => {
        if (typedValue && typedValue.trim() !== '') hasUserTypedRef.current = true;
    }, [typedValue]);

    const inputCurrency = usePaymentStore(state => state.currencies['usdt-trc20']);
    const outputCurrency = useBankTransferStore(state => state.selectedCurrency!);

    const calc = useMemo(() => {
        const rate = outputCurrency.exchangeRate > 0 ? outputCurrency.exchangeRate : 1;

        // feeRate: 0.3 => 0.003 (0.3%)
        const rawFee = outputCurrency.feeRate ?? 0;
        const feeRate = rawFee > 0.05 ? rawFee / 100 : rawRate; // keep previous heuristic
        const feeMinUsd = outputCurrency.feeMin ?? 0;

        let inputUsd: number | null = null;     // USD total (c учётом комиссии)
        let payoutAmount: number | null = null; // THB net (что получит получатель) — это и уходит на бэк
        let feeUsd: number | null = null;       // USD комиссия
        let error: 'empty' | 'invalid' | 'min' | 'max' | null = null;

        if (!typedValue || !typedValue.trim()) {
            if (hasUserTypedRef.current) {
                return { rate, inputUsd, payoutAmount, feeUsd, error: 'empty' as const };
            }
            return { rate, inputUsd, payoutAmount, feeUsd, error: null };
        }

        const v = toNumberStrict(typedValue);
        if (v === null || v < 0) {
            return { rate, inputUsd, payoutAmount, feeUsd, error: 'invalid' as const };
        }

        const minTarget = outputCurrency.minAmount; // now treated as amount IN TARGET CURRENCY
        const maxTarget = outputCurrency.maxAmount;

        if (field === CalculatorField.Input) {
            inputUsd = round2(v);

            // вычисляем netUsd/payoutAmount по логике бэка (бек ждёт payout в THB)
            const netByRate = inputUsd / (1 + feeRate);
            let netUsd: number;
            if (netByRate * feeRate >= feeMinUsd) {
                netUsd = round2(netByRate);
                feeUsd = round2(inputUsd - netUsd);
            } else {
                netUsd = round2(Math.max(inputUsd - feeMinUsd, 0));
                feeUsd = round2(inputUsd - netUsd);
            }
            payoutAmount = round2(netUsd * rate);

            // Лимиты — в OUTPUT (THB)
            if (payoutAmount < minTarget) return { rate, inputUsd, payoutAmount, feeUsd, error: 'min' as const };
            if (payoutAmount > maxTarget) return { rate, inputUsd, payoutAmount, feeUsd, error: 'max' as const };
        } else {
            // field === Output: пользователь вводит payout в целевой валюте (THB)
            payoutAmount = round2(v);

            const netUsd = round2(payoutAmount / rate);
            feeUsd = round2(Math.max(netUsd * feeRate, feeMinUsd));
            inputUsd = round2(netUsd + feeUsd);

            // Лимиты — в OUTPUT (THB) -> сравниваем payoutAmount с minTarget / maxTarget
            if (payoutAmount < minTarget) return { rate, inputUsd, payoutAmount, feeUsd, error: 'min' as const };
            if (payoutAmount > maxTarget) return { rate, inputUsd, payoutAmount, feeUsd, error: 'max' as const };
        }

        return { rate, inputUsd, payoutAmount, feeUsd, error };
    }, [
        field,
        typedValue,
        outputCurrency.exchangeRate,
        outputCurrency.feeRate,
        outputCurrency.feeMin,
        outputCurrency.minAmount,
        outputCurrency.maxAmount,
    ]);

    const values = useMemo(() => {
        const empty = {
            [CalculatorField.Input]: '',
            [CalculatorField.Output]: '',
        };
        if (!typedValue) return empty;

        if (field === CalculatorField.Input) {
            return {
                [CalculatorField.Input]: typedValue,
                [CalculatorField.Output]: toStr2(calc.payoutAmount),
            };
        }
        return {
            [CalculatorField.Input]: toStr2(calc.inputUsd),
            [CalculatorField.Output]: typedValue,
        };
    }, [field, typedValue, calc.inputUsd, calc.payoutAmount]);

    const handleInput = (field: CalculatorField, value: string) => {
        const setCalculator = useBankTransferStore.getState().setCalculator;
        setCalculator(field, value);
    };

    const handleCurrencySelect = useCallback((currency: BankTransferCurrency) => {
        const { setCalculator, setCurrency } = useBankTransferStore.getState();
        setCalculator(CalculatorField.Input, '');
        setCurrency(currency);
    }, []);

    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const hasError = !!calc.error;
    const isSubmitDisabled =
        !values[CalculatorField.Input].length ||
        !values[CalculatorField.Output].length ||
        hasError;

    const navigate = useNavigate();
    const handleSubmit = useCallback(async () => {
        setSubmitLoading(true);
        const payoutAmount = values[CalculatorField.Output];
        useBankTransferStore.getState().setPayoutAmount(payoutAmount);
        await useBankTransferRequiredFields.getState().loadCurrencyFields({
            method,
            currency: outputCurrency.currency
        });
        setSubmitLoading(false);
        navigate('/bank-transfer/details');
    }, [values, method, outputCurrency.currency, isSubmitDisabled, setSubmitLoading, navigate]);

    const availableTransferCurrencies = useBankTransferCurrenciesStore(state => state.bankTransferCurrencies);
    const availableTransferSwiftCurrencies = useBankTransferCurrenciesStore(state => state.globalBankTransferCurrencies);

    const availableCurrencies = useMemo(() => {
        return method === BankTransferMethod.BankTransfer
            ? availableTransferCurrencies
            : availableTransferSwiftCurrencies;
    }, [method, availableTransferCurrencies, availableTransferSwiftCurrencies]);

    useEffect(() => {
        if (calc.error) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
    }, [calc.error]);

    const inputCurrencyNode = useMemo(() => {
        return (
            <SelectedCurrency
                name={inputCurrency.name}
                image={inputCurrency.image}
            />
        );
    }, [inputCurrency.name, inputCurrency.image]);

    const outputCurrencyNode = useMemo(() => {
        return (
            <CurrencySelect
                selectedCurrency={outputCurrency}
                availableCurrencies={availableCurrencies}
                onSelect={handleCurrencySelect}
            />
        );
    }, [outputCurrency, availableCurrencies, handleCurrencySelect]);

    let exchangeRate: string = '';
    if (calc.rate && Number.isFinite(calc.rate)) {
        exchangeRate = `1 USD = ${formatCurrency(calc.rate, outputCurrency.currency, locale, 2)} ${outputCurrency.currency}`;
    }

    let error: string | null = null;
    if (calc.error === 'empty') {
        error = t('Enter the amount');
    } else if (calc.error === 'invalid') {
        error = t('Please enter a valid amount');
    } else if (calc.error === 'min') {
        error = t('Minimum transfer is {{amount}}', {
            amount: formatCurrency(outputCurrency.minAmount, outputCurrency.currency, locale),
        });
    } else if (calc.error === 'max') {
        error = t('Maximum transfer is {{amount}}', {
            amount: formatCurrency(outputCurrency.maxAmount, outputCurrency.currency, locale),
        });
    }

    return (
        <>
            <div className={classNames(styles.root, className)}>
                <div className={styles.fields}>
                    <CalcInput
                        name='input'
                        label={t('You are sending')}
                        value={values[CalculatorField.Input]}
                        currencySelect={inputCurrencyNode}
                        onInput={(value) => handleInput(CalculatorField.Input, value)}
                    />
                    <CalcInput
                        name='payout'
                        label={t('Payout amount')}
                        value={values[CalculatorField.Output]}
                        currencySelect={outputCurrencyNode}
                        onInput={(value) => handleInput(CalculatorField.Output, value)}
                    />
                </div>

                {hasError ? (
                    <Text
                        type="captionSmall"
                        align="left"
                        className={classNames(styles.caption, styles.error)}
                    >
                        {error}
                    </Text>
                ) : (
                    (calc.feeUsd != null && Number.isFinite(calc.rate)) && (
                        <div className={styles.details}>
                            <CalcProperty
                                label={t('Exchange rate')}
                                value={exchangeRate}
                            />
                            <CalcProperty
                                label={t('Fee')}
                                value={formatCurrency(round2(calc.feeUsd!), 'usd', locale)}
                            />
                        </div>
                    )
                )}
            </div>

            <TelegramMainButton
                text={t('Continue')}
                visible
                loading={isSubmitLoading}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            />
        </>
    );
}