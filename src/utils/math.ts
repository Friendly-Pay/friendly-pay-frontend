import BigNumber from 'bignumber.js';

export const convertFromMinimalUnit = (amount: string, exponent: number) => {
    return new BigNumber(amount).multipliedBy(Math.pow(10, -exponent)).toNumber();
};

export const convertToMinimalUnit = function (amount: string, exponent: number) {
    return new BigNumber(amount).multipliedBy(Math.pow(10, exponent)).toNumber();
};