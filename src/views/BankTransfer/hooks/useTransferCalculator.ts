import { CalculatorField } from '../state/store';
import { BankTransferCurrency } from '../state/types';
import { useEffect, useMemo, useRef, useState } from 'react';

export type CalculationError = 'empty' | 'min' | 'max' | 'invalid' | null;

const DECIMALS = 2;
const SCALE = 10 ** DECIMALS;
const EMPTY_ERROR_DELAY_MS = 500;

const normalizeInputValue = (rawValue: string): string => {
    if (!rawValue) return '';
    const normalized = rawValue.replace(/\s+/g, '').replace(',', '.');
    const parts = normalized.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
    return normalized;
};

const parseInputValue = (rawValue: string): number | null => {
    const normalized = normalizeInputValue(rawValue);
    if (normalized === '' || normalized === '.' || normalized === '-' || normalized === '-.') return null;
    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
};

const toMinorUnits = (value: number): number => {
    return Math.round(value * SCALE);
};

const fromMinorUnits = (minorUnits: number): number => {
    return minorUnits / SCALE;
};

const clampNonNegative = (value: number): number => {
    return value < 0 ? 0 : value;
};

const convertToUsd = (amount: number, exchangeRate: number) => Number((amount / exchangeRate).toFixed(DECIMALS));

export const useTransferCalculator = (
    fieldType: CalculatorField,
    inputValue: string,
    currency: BankTransferCurrency,
) => {
    const parsedInputValue = useMemo(() => parseInputValue(inputValue), [inputValue]);

    const wasNonEmptyRef = useRef(false);
    const emptyTimerIdRef = useRef<number | null>(null);
    const minTimerIdRef = useRef<number | null>(null);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isMin, setIsMin] = useState(false);

    useEffect(() => {
        const isCurrentlyEmpty = !inputValue || inputValue.trim() === '';
        if (!isCurrentlyEmpty) {
            wasNonEmptyRef.current = true;
            if (emptyTimerIdRef.current) {
                clearTimeout(emptyTimerIdRef.current);
                emptyTimerIdRef.current = null;
            }
            setIsEmpty(false);
            return;
        }

        if (wasNonEmptyRef.current) {
            if (emptyTimerIdRef.current) clearTimeout(emptyTimerIdRef.current);
            emptyTimerIdRef.current = setTimeout(() => setIsEmpty(true), EMPTY_ERROR_DELAY_MS);
        } else {
            setIsEmpty(false);
        }

        return () => {
            if (emptyTimerIdRef.current) {
                window.clearTimeout(emptyTimerIdRef.current);
                emptyTimerIdRef.current = null;
            }
        };
    }, [inputValue]);

    useEffect(() => {
        return () => {
            if (minTimerIdRef.current) {
                window.clearTimeout(minTimerIdRef.current);
                minTimerIdRef.current = null;
            }
        };
    }, []);

    const exchangeRate = currency.exchangeRate > 0 ? currency.exchangeRate : 1;
    const {
        netAmount,
        feeAmount,
        totalAmount,
    } = useMemo(() => {
        if (parsedInputValue === null || parsedInputValue < 0) {
            return {
                netAmount: null,
                feeAmount: null,
                totalAmount: null,
            };
        }

        let netMinor: number;
        let feeMinor: number;
        let totalMinor: number;

        if (fieldType === CalculatorField.Input) {
            // Расчет от введенной нетто-суммы
            netMinor = clampNonNegative(toMinorUnits(parsedInputValue));
            const calculatedFee = Math.round(netMinor * currency.feeRate);
            const minFee = toMinorUnits(currency.feeMin);
            feeMinor = Math.max(calculatedFee, minFee);
            totalMinor = netMinor + feeMinor;
        } else {
            // Расчет от введенной общей суммы
            totalMinor = clampNonNegative(toMinorUnits(parsedInputValue));
            const minFee = toMinorUnits(currency.feeMin);

            // Расчет нетто-суммы через итеративное приближение
            let estimatedNetMinor = Math.round(totalMinor / (1 + currency.feeRate));
            let calculatedFee: number;

            // 2-3 итерации для точного расчета
            for (let i = 0; i < 3; i++) {
                calculatedFee = Math.max(Math.round(estimatedNetMinor * currency.feeRate), minFee);
                estimatedNetMinor = totalMinor - calculatedFee;
            }

            calculatedFee = Math.max(Math.round(estimatedNetMinor * currency.feeRate), minFee);
            netMinor = totalMinor - calculatedFee;
            feeMinor = calculatedFee;

            // Проверка и корректировка минимальной комиссии
            if (feeMinor < minFee) {
                feeMinor = minFee;
                netMinor = totalMinor - feeMinor;
            }
        }

        return {
            netAmount: fromMinorUnits(netMinor),
            feeAmount: fromMinorUnits(feeMinor),
            totalAmount: fromMinorUnits(totalMinor),
        };
    }, [parsedInputValue, currency, fieldType]);

    let netAmountUsd: number | null = null;
    let feeAmountUsd: number | null = null;
    let totalAmountUsd: number | null = null;
    if (netAmount && feeAmount && totalAmount) {
        netAmountUsd = convertToUsd(netAmount, exchangeRate);
        feeAmountUsd = convertToUsd(feeAmount, exchangeRate);
        totalAmountUsd = convertToUsd(totalAmount, exchangeRate);
    }

    useEffect(() => {
        if (minTimerIdRef.current) {
            window.clearTimeout(minTimerIdRef.current);
            minTimerIdRef.current = null;
        }

        const hasParsedButInvalid = inputValue && parsedInputValue === null;
        if (hasParsedButInvalid) {
            setIsMin(false);
            return;
        }

        if (totalAmount !== null) {
            const totalMinor = toMinorUnits(totalAmount);
            const minMinor = toMinorUnits(currency.minAmount);

            if (totalMinor < minMinor) {
                minTimerIdRef.current = setTimeout(() => {
                    setIsMin(true);
                    minTimerIdRef.current = null;
                }, EMPTY_ERROR_DELAY_MS);
                return;
            }
        }

        setIsMin(false);
    }, [totalAmount, parsedInputValue, inputValue, currency.minAmount]);

    let error: CalculationError | null = null;
    if (inputValue && parsedInputValue === null) {
        error = 'invalid';
    } else if ((!inputValue || inputValue.trim() === '') && isEmpty) {
        error = 'empty';
    } else if (isMin) {
        error = 'min';
    } else if (totalAmount !== null) {
        const totalMinor = toMinorUnits(totalAmount);
        const maxMinor = toMinorUnits(currency.maxAmount);
        if (totalMinor > maxMinor) {
            error = 'max';
        }
    }
    return {
        netAmount,
        feeAmount,
        totalAmount,
        netAmountUsd,
        feeAmountUsd,
        totalAmountUsd,
        exchangeRate,
        isEmpty,
        error,
        hasError: !!error
    };
};
