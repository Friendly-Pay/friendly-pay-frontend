import { AmountInputProps } from './AmountInput';
import { formatAmount, getCurrencySymbol } from '@/utils/format';

/**
 * Форматирует введенное значение
 * @param enteredValue Значение введенное в инпут
 * @param currency валюта
 * @param minority количество минорных единиц
 */
export function getFormattedValue(enteredValue: string, currency: string, minority: number) {
    if (!enteredValue || enteredValue === '-') {
        return enteredValue;
    }

    let [head, tail] = enteredValue.split(',');

    // При вводе "-," указываем, что имеется в виду "-0,"
    if (head === '-') {
        head = '-0';
    }

    let { majorPart } = formatAmount({
        value: Number(head) * minority,
        currency,
        minority,
        negativeSymbol: 'hyphen-minus',
        locale: 'ru'
    });

    // Так как -0 === 0, formatAmount возвращает положительное значение. Исправляем это здесь
    if (/^-(,|0),?/.test(enteredValue) && majorPart === '0') {
        majorPart = `-${majorPart}`;
    }

    if (!tail && enteredValue.includes(',')) {
        return majorPart.concat(',');
    }

    if (tail) {
        return majorPart.concat(',', tail.slice(0, minority.toString().length - 1));
    }

    return majorPart;
}

export function getAmountValueFromStr(str: string, minority: number) {
    if (str === '' || str === '-') {
        return null;
    }

    return Math.round(Number(str.replace(',', '.').replace(/[^0-9.-]/g, '')) * minority);
}

export function getCurrencyCodeWithFormat(
    currency: string,
    codeFormat: AmountInputProps['codeFormat'],
) {
    if (!currency) {
        return '';
    }

    return codeFormat === 'symbolic' ? getCurrencySymbol(currency as any) : currency;
}

export const getVisiblePlaceholder = (
    placeholder: string,
    label: React.ReactNode,
    labelView?: string,
) => {
    if (!label) return placeholder;

    return labelView === 'outer' ? placeholder : undefined;
};
