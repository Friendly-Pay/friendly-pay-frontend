import usdtBep from 'assets/currency/usdt-bep.png?inline';
import usdtTrc from 'assets/currency/usdt-trc.png?inline';

const TOKENS_SYMBOLS = {
    USDT: '\u0055\u0053\u0044\u0054',    // "USDT"
    // BTC: '\u20BF',                    // ₿
    // ETH: '\u039E',                    // Ξ
    // TON: '\u0054\u004F\u004E',        // "TON"
    // TRX: '\u0054\u0052\u0058',        // "TRX"
    // AXT: '\u0041\u0058\u0054',        // "AXT"
} as const;

const USDT = {
    code: 10001,
    mnemonicCode: 'USDT',
    minorUnits: 1_000_000,
    unicodeSymbol: 'USDT',
    name: 'USDT',
    fullName: 'Tether USD',
} as const;

const USDTTRC = {
    ...USDT,
    id: 'USDTTRC',
    type: 'CRYPTO',
    image: usdtTrc,
    network: 'TRC20'
} as const;

const USDTBSC = {
    ...USDT,
    id: 'USDTBSC',
    type: 'CRYPTO',
    image: usdtBep,
    network: 'BEP20'
} as const;

// const BTC = {
//     code: 10002,
//     mnemonicCode: 'BTC',
//     minorUnits: 100_000_000,
//     unicodeSymbol: '₿',
//     fullName: 'Bitcoin',
// } as const;

// const ETH = {
//     code: 10003,
//     mnemonicCode: 'ETH',
//     minorUnits: 1_000_000_000_000_000_000,
//     unicodeSymbol: 'Ξ',
//     fullName: 'Ethereum',
// } as const;

// const TON = {
//     code: 10004,
//     mnemonicCode: 'TON',
//     minorUnits: 1_000_000_000,
//     unicodeSymbol: 'TON',
//     fullName: 'Ton Coin',
// } as const;

// const TRX = {
//     code: 10005,
//     mnemonicCode: 'TRX',
//     minorUnits: 1_000_000,
//     unicodeSymbol: 'TRX',
//     fullName: 'Tron',
// } as const;

// const AXT = {
//     code: 10006,
//     mnemonicCode: 'AXT',
//     minorUnits: 1_000_000_000_000_000_000,
//     unicodeSymbol: 'AXT',
//     fullName: 'Axioma',
// } as const;

const TOKENS = {
    // USDT: USDT,
    USDTTRC: USDTTRC,
    USDTBSC: USDTBSC,
    // BTC: BTC,
    // ETH: ETH,
    // TON: TON,
    // TRX: TRX,
    // AXT: AXT,
} as const;

export { TOKENS, TOKENS_SYMBOLS }; 