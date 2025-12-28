export const toMinorUnits = (amount: number, minority: number): number => {
    return Math.round(amount * minority);
};

export const fromMinorUnits = (minorAmount: number, minority: number): number => {
    return minorAmount / minority;
};

export const convertAmount = ({ amountMinor, rate, sourceMinority, targetMinority }: {
    amountMinor: number,
    rate: number,
    sourceMinority: number,
    targetMinority: number
}) => {
    const convertedAmount = (amountMinor / sourceMinority) / rate;
    const amountUnit = toMinorUnits(convertedAmount, targetMinority);
    return amountUnit;
};