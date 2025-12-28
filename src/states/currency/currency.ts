import spbRub from 'assets/currency/sbp.png?inline';

const CURRENCY_SYMBOLS = {
    ALL: '\u004c\u0065\u006b',
    AFN: '\u060b',
    ARS: '\u0024',
    AWG: '\u0192',
    AUD: '\u0041\u0024',
    AZN: '\u20bc',
    BSD: '\u0024',
    BBD: '\u0024',
    BYN: '\u0042\u0059\u004e',
    BZD: '\u0042\u005a\u0024',
    BMD: '\u0024',
    BOB: '\u0024\u0062',
    BOV: '\u0024\u0062',
    BAM: '\u004b\u004d',
    BWP: '\u0050',
    BGN: '\u0042\u0047\u004e',
    BRL: '\u0052\u0024',
    BND: '\u0024',
    KHR: '\u17db',
    CAD: '\u0043\u0024',
    KYD: '\u0024',
    CLP: '\u0024',
    CNY: '\u00a5',
    COP: '\u0024',
    COU: '\u0024',
    CRC: '\u20a1',
    HRK: '\u0048\u0052\u004b',
    CUP: '\u20b1',
    CUC: '\u20b1',
    CZK: '\u004b\u010d',
    DKK: '\u0044\u004b\u004b',
    DOP: '\u0052\u0044\u0024',
    XCD: '\u0024',
    EGP: '\u004c\u0045',
    SVC: '\u0024',
    EEK: '\u0045\u0045\u004b',
    EUR: '\u20ac',
    FKP: '\u00a3',
    FJD: '\u0024',
    FRF: '\u20a3',
    GHC: '\u00a2',
    GIP: '\u00a3',
    GTQ: '\u0051',
    GGP: '\u00a3',
    GYD: '\u0024',
    HNL: '\u004c',
    HKD: '\u0048\u004b\u0024',
    HUF: '\u0046\u0074',
    ISK: '\u006b\u0072',
    INR: '\u20b9',
    IDR: '\u0052\u0070',
    IRR: '\ufdfc',
    IMP: '\u00a3',
    ILS: '\u20aa',
    JMD: '\u004a\u0024',
    JPY: '\u00a5',
    JEP: '\u00a3',
    KZT: '\u20B8',
    KGS: '\u004B\u0047\u0053',
    LAK: '\u20ad',
    LVL: '\u004c\u0073',
    LBP: '\u00a3',
    LRD: '\u0024',
    LTL: '\u004c\u0074',
    MKD: '\u0434\u0435\u043d',
    MYR: '\u004d\u0059\u0052',
    MUR: '\u20a8',
    MXN: '\u004d\u0058\u0024',
    MXV: '\u0024',
    MNT: '\u20ae',
    MZN: '\u004d\u0054',
    NAD: '\u0024',
    NPR: '\u20a8',
    ANG: '\u0192',
    NZD: '\u004e\u005a\u0024',
    NIO: '\u0043\u0024',
    NGN: '\u20a6',
    KPW: '\u20a9',
    NOK: '\u006b\u0072',
    OMR: '\ufdfc',
    PKR: '\u20a8',
    PAB: '\u0042\u002f\u002e',
    PYG: '\u0047\u0073',
    PEN: '\u0053\u002f\u002e',
    PHP: '\u20b1',
    PLN: '\u007a\u0142',
    QAR: '\ufdfc',
    RON: '\u006c\u0065\u0069',
    RUR: '\u20bd',
    RUB: '\u20bd',
    SHP: '\u00a3',
    SAR: '\ufdfc',
    RSD: '\u0434\u0438\u043d',
    SCR: '\u20a8',
    SGD: '\u0053\u0024',
    SBD: '\u0024',
    SOS: '\u0053',
    ZAR: '\u005a\u0041\u0052',
    KRW: '\u20a9',
    LKR: '\u20a8',
    SEK: '\u0053\u0045\u004b',
    CHF: '\u20a3',
    SRD: '\u0024',
    SYP: '\u00a3',
    TWD: '\u004e\u0054\u0024',
    THB: '\u0e3f',
    TTD: '\u0054\u0054\u0024',
    TRY: '\u20ba',
    TRL: '\u20ba',
    TVD: '\u0024',
    UAH: '\u20b4',
    GBP: '\u00a3',
    USD: '\u0024',
    UYU: '\u0024\u0055',
    UYI: '\u0024\u0055',
    UZS: '\u0055\u005a\u0053',
    VEF: '\u0042\u0073',
    VND: '\u20ab',
    YER: '\ufdfc',
    ZWD: '\u005a\u0024',
    A98: '\u0433',
    A99: '\u0433',
    A76: '\u0433',
    A33: '\u0433',
    AMD: '\u058f',
    BDT: '\u09f3',
    BIF: '\u20a3',
    GEL: '\u20BE',
    GHS: '\u20B5',
    SDG: '\u00A3',
    TJS: '\u0054\u004a\u0053',
    KWD: '\u004b\u0057\u0044',
    MDL: '\u004c',
    AED: '\u0041\u0045\u0044',
    DZD: '\u0044\u005a\u0044',
    BHD: '\u062f',
    VED: '\u0042\u0053\u0024',
    VES: '\u0024',
    VUV: '\u0056\u0055\u0056',
    GNF: '\u0047\u004e\u0046',
    HTG: '\u0048\u0054\u0047',
    GMD: '\u0047\u004d\u0044',
    STN: '\u0053\u0054\u004e',
    ZWL: '\u005a\u0057\u004c',
    ZMW: '\u005a\u004d\u0057',
    JOD: '\u062f',
    IQD: '\u0639\u062f',
    AOA: '\u0041\u004f\u0041',
    KES: '\u004b\u0045\u0053',
    PGK: '\u0050\u0047\u004b',
    KMF: '\u004b\u004d\u0046',
    CDF: '\u0043\u0044\u0046',
    MMK: '\u004d\u004d\u004b',
    SLE: '\u0053\u004c\u0045',
    SLL: '\u004c\u004c\u004b',
    LYD: '\u004c\u0059\u0044',
    SZL: '\u0053\u005a\u004c',
    LSL: '\u004c\u0053\u004c',
    MWK: '\u004d\u0057\u004b',
    MGA: '\u004d\u0047\u0041',
    MAD: '\u004d\u0041\u0044',
    ERN: '\u0045\u0052\u004e',
    BTN: '\u0042\u0054\u004e',
    TMT: '\u0054\u004d\u0054',
    TOP: '\u0054\u004f\u0050',
    MOP: '\u004d\u004f\u0050',
    MVR: '\u004d\u0056\u0052',
    TZS: '\u0054\u005a\u0053',
    WST: '\u0057\u0053\u0054',
    TND: '\u062f',
    UGX: '\u0047\u0055\u0058',
    MRU: '\u004d\u0052\u0055',
    DJF: '\u0044\u004a\u0046',
    XAF: '\u0042\u0041',
    XPF: '\u0050\u0046',
    XOF: '\u0042\u0041',
    RWF: '\u0052\u0057\u0046',
    CVE: '\u0056\u0043\u0045',
    ETB: '\u0045\u0054\u0042',
    SSP: '\u0053\u0053\u0050',
} as const;

// const AUD = {
//     code: 36,
//     mnemonicCode: 'AUD',
//     minorUnits: 100,
//     fullName: 'Австралийский доллар',
// } as const;
// const AZN = {
//     code: 944,
//     mnemonicCode: 'AZN',
//     minorUnits: 100,
//     unicodeSymbol: '₼',
//     fullName: 'Азербайджанский манат',
// } as const;
// const DZD = {
//     code: 12,
//     mnemonicCode: 'DZD',
//     minorUnits: 100,
//     fullName: 'Алжирский динар',
// } as const;
// const ARS = {
//     code: 32,
//     mnemonicCode: 'ARS',
//     minorUnits: 100,
//     unicodeSymbol: '₳',
//     fullName: 'Аргентинское песо',
// } as const;
// const AMD = {
//     code: 51,
//     mnemonicCode: 'AMD',
//     minorUnits: 100,
//     unicodeSymbol: '֏',
//     fullName: 'Армянский драм',
// } as const;
// const AWG = {
//     code: 533,
//     mnemonicCode: 'AWG',
//     minorUnits: 100,
//     fullName: 'Арубанский флорин',
// } as const;
// const AFN = {
//     code: 971,
//     mnemonicCode: 'AFN',
//     minorUnits: 100,
//     unicodeSymbol: '؋',
//     fullName: 'Афгани',
// } as const;
// const BSD = {
//     code: 44,
//     mnemonicCode: 'BSD',
//     minorUnits: 100,
//     fullName: 'Багамский доллар',
// } as const;
// const PAB = {
//     code: 590,
//     mnemonicCode: 'PAB',
//     minorUnits: 100,
//     fullName: 'Бальбоа',
// } as const;
// const BBD = {
//     code: 52,
//     mnemonicCode: 'BBD',
//     minorUnits: 100,
//     fullName: 'Барбадосский доллар',
// } as const;
// const THB = {
//     code: 764,
//     mnemonicCode: 'THB',
//     minorUnits: 100,
//     unicodeSymbol: '฿',
//     fullName: 'Бат',
// } as const;
// const BHD = {
//     code: 48,
//     mnemonicCode: 'BHD',
//     minorUnits: 1000,
//     fullName: 'Бахрейнский динар',
// } as const;
// const BZD = {
//     code: 84,
//     mnemonicCode: 'BZD',
//     minorUnits: 100,
//     fullName: 'Белизский доллар',
// } as const;
// const BYN = {
//     code: 933,
//     mnemonicCode: 'BYN',
//     minorUnits: 100,
//     fullName: 'Белорусский рубль',
// } as const;
// const BMD = {
//     code: 60,
//     mnemonicCode: 'BMD',
//     minorUnits: 100,
//     fullName: 'Бермудский доллар',
// } as const;
// const BGN = {
//     code: 975,
//     mnemonicCode: 'BGN',
//     minorUnits: 100,
//     fullName: 'Болгарский лев',
// } as const;
// const VED = {
//     code: 926,
//     mnemonicCode: 'VED',
//     minorUnits: 100,
//     fullName: 'Боливар соберано',
// } as const;
// const VES = {
//     code: 928,
//     mnemonicCode: 'VES',
//     minorUnits: 100,
//     fullName: 'Боливар соберано',
// } as const;
// const BOB = {
//     code: 68,
//     mnemonicCode: 'BOB',
//     minorUnits: 100,
//     fullName: 'Боливиано',
// } as const;
// const BRL = {
//     code: 986,
//     mnemonicCode: 'BRL',
//     minorUnits: 100,
//     unicodeSymbol: '₢',
//     fullName: 'Бразильский реал',
// } as const;
// const BND = {
//     code: 96,
//     mnemonicCode: 'BND',
//     minorUnits: 100,
//     fullName: 'Брунейский доллар',
// } as const;
// const BIF = {
//     code: 108,
//     mnemonicCode: 'BIF',
//     minorUnits: 100,
//     fullName: 'Бурундийский франк',
// } as const;
// const VUV = {
//     code: 548,
//     mnemonicCode: 'VUV',
//     minorUnits: 1,
//     fullName: 'Вату',
// } as const;
// const KRW = {
//     code: 410,
//     mnemonicCode: 'KRW',
//     minorUnits: 1,
//     unicodeSymbol: '₩',
//     fullName: 'Вона',
// } as const;
// const XCD = {
//     code: 951,
//     mnemonicCode: 'XCD',
//     minorUnits: 100,
//     fullName: 'Восточно-карибский доллар',
// } as const;
// const GYD = {
//     code: 328,
//     mnemonicCode: 'GYD',
//     minorUnits: 100,
//     fullName: 'Гайанский доллар',
// } as const;
// const GNF = {
//     code: 324,
//     mnemonicCode: 'GNF',
//     minorUnits: 100,
//     fullName: 'Гвинейский франк',
// } as const;
// const GIP = {
//     code: 292,
//     mnemonicCode: 'GIP',
//     minorUnits: 100,
//     fullName: 'Гибралтарский фунт',
// } as const;
// const HKD = {
//     code: 344,
//     mnemonicCode: 'HKD',
//     minorUnits: 100,
//     fullName: 'Гонконгский доллар',
// } as const;
// const UAH = {
//     code: 980,
//     mnemonicCode: 'UAH',
//     minorUnits: 100,
//     unicodeSymbol: '₴',
//     fullName: 'Гривна',
// } as const;
// const PYG = {
//     code: 600,
//     mnemonicCode: 'PYG',
//     minorUnits: 100,
//     fullName: 'Гуарани',
// } as const;
// const HTG = {
//     code: 332,
//     mnemonicCode: 'HTG',
//     minorUnits: 100,
//     fullName: 'Гурд',
// } as const;
// const GMD = {
//     code: 270,
//     mnemonicCode: 'GMD',
//     minorUnits: 100,
//     fullName: 'Даласи',
// } as const;
// const DKK = {
//     code: 208,
//     mnemonicCode: 'DKK',
//     minorUnits: 100,
//     unicodeSymbol: '₻',
//     fullName: 'Датская крона',
// } as const;
// const MKD = {
//     code: 807,
//     mnemonicCode: 'MKD',
//     minorUnits: 100,
//     fullName: 'Денар',
// } as const;
// const AED = {
//     code: 784,
//     mnemonicCode: 'AED',
//     minorUnits: 100,
//     fullName: 'Дирхам (ОАЭ)',
// } as const;
// const STN = {
//     code: 930,
//     mnemonicCode: 'STN',
//     minorUnits: 100,
//     fullName: 'Добра',
// } as const;
// const ZWL = {
//     code: 932,
//     mnemonicCode: 'ZWL',
//     minorUnits: 100,
//     fullName: 'Доллар Зимбабве',
// } as const;
// const NAD = {
//     code: 516,
//     mnemonicCode: 'NAD',
//     minorUnits: 100,
//     fullName: 'Доллар Намибии',
// } as const;
// const KYD = {
//     code: 136,
//     mnemonicCode: 'KYD',
//     minorUnits: 100,
//     fullName: 'Доллар островов Кайман',
// } as const;
// const SBD = {
//     code: 90,
//     mnemonicCode: 'SBD',
//     minorUnits: 100,
//     fullName: 'Доллар Соломоновых островов',
// } as const;
// const USD = {
//     code: 840,
//     mnemonicCode: 'USD',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Доллар США',
// } as const;
// const TTD = {
//     code: 780,
//     mnemonicCode: 'TTD',
//     minorUnits: 100,
//     fullName: 'Доллар Тринидада и Тобаго',
// } as const;
// const FJD = {
//     code: 242,
//     mnemonicCode: 'FJD',
//     minorUnits: 100,
//     fullName: 'Доллар Фиджи',
// } as const;
// const DOP = {
//     code: 214,
//     mnemonicCode: 'DOP',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Доминиканское песо',
// } as const;
// const VND = {
//     code: 704,
//     mnemonicCode: 'VND',
//     minorUnits: 100,
//     unicodeSymbol: '₫',
//     fullName: 'Донг',
// } as const;
// const EUR = {
//     code: 978,
//     mnemonicCode: 'EUR',
//     minorUnits: 100,
//     unicodeSymbol: '€',
//     fullName: 'Евро',
// } as const;
// const EGP = {
//     code: 818,
//     mnemonicCode: 'EGP',
//     minorUnits: 100,
//     fullName: 'Египетский фунт',
// } as const;
// const COU = {
//     code: 970,
//     mnemonicCode: 'COU',
//     minorUnits: 100,
//     fullName: 'Единица реальной стоимости',
// } as const;
// const ZMW = {
//     code: 967,
//     mnemonicCode: 'ZMW',
//     minorUnits: 100,
//     fullName: 'Замбийская квача',
// } as const;
// const PLN = {
//     code: 985,
//     mnemonicCode: 'PLN',
//     minorUnits: 100,
//     fullName: 'Злотый',
// } as const;
// const NIO = {
//     code: 558,
//     mnemonicCode: 'NIO',
//     minorUnits: 100,
//     fullName: 'Золотая кордоба',
// } as const;
// const JPY = {
//     code: 392,
//     mnemonicCode: 'JPY',
//     minorUnits: 1,
//     unicodeSymbol: '¥',
//     fullName: 'Иена',
// } as const;
// const INR = {
//     code: 356,
//     mnemonicCode: 'INR',
//     minorUnits: 100,
//     unicodeSymbol: '₹',
//     fullName: 'Индийская рупия',
// } as const;
// const JOD = {
//     code: 400,
//     mnemonicCode: 'JOD',
//     minorUnits: 1000,
//     fullName: 'Иорданский динар',
// } as const;
// const IQD = {
//     code: 368,
//     mnemonicCode: 'IQD',
//     minorUnits: 1000,
//     fullName: 'Иракский динар',
// } as const;
// const IRR = {
//     code: 364,
//     mnemonicCode: 'IRR',
//     minorUnits: 100,
//     fullName: 'Иранский риал',
// } as const;
// const ISK = {
//     code: 352,
//     mnemonicCode: 'ISK',
//     minorUnits: 1,
//     fullName: 'Исландская крона',
// } as const;
// const YER = {
//     code: 886,
//     mnemonicCode: 'YER',
//     minorUnits: 100,
//     fullName: 'Йеменский риал',
// } as const;
// const CAD = {
//     code: 124,
//     mnemonicCode: 'CAD',
//     minorUnits: 100,
//     fullName: 'Канадский доллар',
// } as const;
// const QAR = {
//     code: 634,
//     mnemonicCode: 'QAR',
//     minorUnits: 100,
//     fullName: 'Катарский риал',
// } as const;
// const AOA = {
//     code: 973,
//     mnemonicCode: 'AOA',
//     minorUnits: 100,
//     fullName: 'Кванза',
// } as const;
// const KES = {
//     code: 404,
//     mnemonicCode: 'KES',
//     minorUnits: 100,
//     fullName: 'Кенийский шиллинг',
// } as const;
// const GTQ = {
//     code: 320,
//     mnemonicCode: 'GTQ',
//     minorUnits: 100,
//     fullName: 'Кетсаль',
// } as const;
// const PGK = {
//     code: 598,
//     mnemonicCode: 'PGK',
//     minorUnits: 100,
//     fullName: 'Кина',
// } as const;
// const COP = {
//     code: 170,
//     mnemonicCode: 'COP',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Колумбийское песо',
// } as const;
// const KMF = {
//     code: 174,
//     mnemonicCode: 'KMF',
//     minorUnits: 1,
//     fullName: 'Коморский франк',
// } as const;
// const BAM = {
//     code: 977,
//     mnemonicCode: 'BAM',
//     minorUnits: 100,
//     fullName: 'Конвертируемая марка',
// } as const;
// const CUC = {
//     code: 931,
//     mnemonicCode: 'CUC',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Конвертируемое песо',
// } as const;
// const CDF = {
//     code: 976,
//     mnemonicCode: 'CDF',
//     minorUnits: 100,
//     fullName: 'Конголезский франк',
// } as const;
// const CRC = {
//     code: 188,
//     mnemonicCode: 'CRC',
//     minorUnits: 100,
//     fullName: 'Коста-риканский колон',
// } as const;
// const CUP = {
//     code: 192,
//     mnemonicCode: 'CUP',
//     minorUnits: 100,
//     fullName: 'Кубинское песо',
// } as const;
// const KWD = {
//     code: 414,
//     mnemonicCode: 'KWD',
//     minorUnits: 1000,
//     fullName: 'Кувейтский динар',
// } as const;
// const HRK = {
//     code: 191,
//     mnemonicCode: 'HRK',
//     minorUnits: 100,
//     fullName: 'Куна',
// } as const;
// const MMK = {
//     code: 104,
//     mnemonicCode: 'MMK',
//     minorUnits: 100,
//     fullName: 'Кьят',
// } as const;
// const LAK = {
//     code: 418,
//     mnemonicCode: 'LAK',
//     minorUnits: 100,
//     unicodeSymbol: '₭',
//     fullName: 'Лаосский кип',
// } as const;
// const GEL = {
//     code: 981,
//     mnemonicCode: 'GEL',
//     minorUnits: 100,
//     unicodeSymbol: '₾',
//     fullName: 'Лари',
// } as const;
// const ALL = {
//     code: 8,
//     mnemonicCode: 'ALL',
//     minorUnits: 100,
//     fullName: 'Лек',
// } as const;
// const HNL = {
//     code: 340,
//     mnemonicCode: 'HNL',
//     minorUnits: 100,
//     fullName: 'Лемпира',
// } as const;
// const SLE = {
//     code: 925,
//     mnemonicCode: 'SLE',
//     minorUnits: 100,
//     fullName: 'Леоне',
// } as const;
// const SLL = {
//     code: 694,
//     mnemonicCode: 'SLL',
//     minorUnits: 100,
//     fullName: 'Леоне',
// } as const;
// const LRD = {
//     code: 430,
//     mnemonicCode: 'LRD',
//     minorUnits: 100,
//     fullName: 'Либерийский доллар',
// } as const;
// const LBP = {
//     code: 422,
//     mnemonicCode: 'LBP',
//     minorUnits: 100,
//     fullName: 'Ливанский фунт',
// } as const;
// const LYD = {
//     code: 434,
//     mnemonicCode: 'LYD',
//     minorUnits: 1000,
//     fullName: 'Ливийский динар',
// } as const;
// const SZL = {
//     code: 748,
//     mnemonicCode: 'SZL',
//     minorUnits: 100,
//     fullName: 'Лилангени',
// } as const;
// const LSL = {
//     code: 426,
//     mnemonicCode: 'LSL',
//     minorUnits: 100,
//     fullName: 'Лоти',
// } as const;
// const MUR = {
//     code: 480,
//     mnemonicCode: 'MUR',
//     minorUnits: 100,
//     fullName: 'Маврикийская рупия',
// } as const;
// const MWK = {
//     code: 454,
//     mnemonicCode: 'MWK',
//     minorUnits: 100,
//     fullName: 'Малавийская квача',
// } as const;
// const MGA = {
//     code: 969,
//     mnemonicCode: 'MGA',
//     minorUnits: 100,
//     fullName: 'Малагасийский ариари',
// } as const;
// const MYR = {
//     code: 458,
//     mnemonicCode: 'MYR',
//     minorUnits: 100,
//     fullName: 'Малайзийский ринггит',
// } as const;
// const MAD = {
//     code: 504,
//     mnemonicCode: 'MAD',
//     minorUnits: 100,
//     fullName: 'Марокканский дирхам',
// } as const;
// const MXN = {
//     code: 484,
//     mnemonicCode: 'MXN',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Мексиканское песо',
// } as const;
// const MZN = {
//     code: 943,
//     mnemonicCode: 'MZN',
//     minorUnits: 100,
//     fullName: 'Мозамбикский метикал',
// } as const;
// const MDL = {
//     code: 498,
//     mnemonicCode: 'MDL',
//     minorUnits: 100,
//     fullName: 'Молдавский лей',
// } as const;
// const NGN = {
//     code: 566,
//     mnemonicCode: 'NGN',
//     minorUnits: 100,
//     unicodeSymbol: '₦',
//     fullName: 'Найра',
// } as const;
// const ERN = {
//     code: 232,
//     mnemonicCode: 'ERN',
//     minorUnits: 100,
//     fullName: 'Накфа',
// } as const;
// const BTN = {
//     code: 64,
//     mnemonicCode: 'BTN',
//     minorUnits: 100,
//     fullName: 'Нгултрум',
// } as const;
// const NPR = {
//     code: 524,
//     mnemonicCode: 'NPR',
//     minorUnits: 100,
//     fullName: 'Непальская рупия',
// } as const;
// const ANG = {
//     code: 532,
//     mnemonicCode: 'ANG',
//     minorUnits: 100,
//     fullName: 'Нидерландский антильский гульден',
// } as const;
// const NZD = {
//     code: 554,
//     mnemonicCode: 'NZD',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Новозеландский доллар',
// } as const;
// const ILS = {
//     code: 376,
//     mnemonicCode: 'ILS',
//     minorUnits: 100,
//     fullName: 'Новый израильский шекель',
// } as const;
// const TWD = {
//     code: 901,
//     mnemonicCode: 'TWD',
//     minorUnits: 100,
//     fullName: 'Новый тайваньский доллар',
// } as const;
// const TMT = {
//     code: 934,
//     mnemonicCode: 'TMT',
//     minorUnits: 100,
//     fullName: 'Новый туркменский манат',
// } as const;
// const NOK = {
//     code: 578,
//     mnemonicCode: 'NOK',
//     minorUnits: 100,
//     fullName: 'Норвежская крона',
// } as const;
// const OMR = {
//     code: 512,
//     mnemonicCode: 'OMR',
//     minorUnits: 1000,
//     fullName: 'Оманский риал',
// } as const;
// const TOP = {
//     code: 776,
//     mnemonicCode: 'TOP',
//     minorUnits: 100,
//     fullName: 'Паанга',
// } as const;
// const PKR = {
//     code: 586,
//     mnemonicCode: 'PKR',
//     minorUnits: 100,
//     fullName: 'Пакистанская рупия',
// } as const;
// const MOP = {
//     code: 446,
//     mnemonicCode: 'MOP',
//     minorUnits: 100,
//     fullName: 'Патака',
// } as const;
// const BWP = {
//     code: 72,
//     mnemonicCode: 'BWP',
//     minorUnits: 100,
//     fullName: 'Пула',
// } as const;
// const KHR = {
//     code: 116,
//     mnemonicCode: 'KHR',
//     minorUnits: 100,
//     fullName: 'Риель',
// } as const;

const RUR = {
    code: 810,
    mnemonicCode: 'RUR',
    minorUnits: 100,
    unicodeSymbol: '₽',
    fullName: 'Российский рубль',
} as const;

const RUB = {
    ...RUR,
    id: 'RUB',
    type: 'RUB',
    name: 'Рубли по СБП',
    image: spbRub,
    shortName: 'В рублях',
    description: 'Через СБП'
} as const;

// const RON = {
//     code: 946,
//     mnemonicCode: 'RON',
//     minorUnits: 100,
//     fullName: 'Румынский лей',
// } as const;
// const IDR = {
//     code: 360,
//     mnemonicCode: 'IDR',
//     minorUnits: 100,
//     unicodeSymbol: '₹',
//     fullName: 'Рупия',
// } as const;
// const MVR = {
//     code: 462,
//     mnemonicCode: 'MVR',
//     minorUnits: 100,
//     fullName: 'Руфия',
// } as const;
// const ZAR = {
//     code: 710,
//     mnemonicCode: 'ZAR',
//     minorUnits: 100,
//     fullName: 'Рэнд',
// } as const;
// const SVC = {
//     code: 222,
//     mnemonicCode: 'SVC',
//     minorUnits: 100,
//     fullName: 'Сальвадорский колон',
// } as const;
// const SAR = {
//     code: 682,
//     mnemonicCode: 'SAR',
//     minorUnits: 100,
//     fullName: 'Саудовский риял',
// } as const;
// const KPW = {
//     code: 408,
//     mnemonicCode: 'KPW',
//     minorUnits: 100,
//     unicodeSymbol: '₩',
//     fullName: 'Северокорейская вона',
// } as const;
// const SCR = {
//     code: 690,
//     mnemonicCode: 'SCR',
//     minorUnits: 100,
//     fullName: 'Сейшельская рупия',
// } as const;
// const RSD = {
//     code: 941,
//     mnemonicCode: 'RSD',
//     minorUnits: 100,
//     fullName: 'Сербский динар',
// } as const;
// const SGD = {
//     code: 702,
//     mnemonicCode: 'SGD',
//     minorUnits: 100,
//     fullName: 'Сингапурский доллар',
// } as const;
// const SYP = {
//     code: 760,
//     mnemonicCode: 'SYP',
//     minorUnits: 100,
//     fullName: 'Сирийский фунт',
// } as const;
// const PEN = {
//     code: 604,
//     mnemonicCode: 'PEN',
//     minorUnits: 100,
//     fullName: 'Соль',
// } as const;
// const KGS = {
//     code: 417,
//     mnemonicCode: 'KGS',
//     minorUnits: 100,
//     fullName: 'Сом',
// } as const;
// const SOS = {
//     code: 706,
//     mnemonicCode: 'SOS',
//     minorUnits: 100,
//     fullName: 'Сомалийский шиллинг',
// } as const;
// const TJS = {
//     code: 972,
//     mnemonicCode: 'TJS',
//     minorUnits: 100,
//     fullName: 'Сомони',
// } as const;
// const SDG = {
//     code: 938,
//     mnemonicCode: 'SDG',
//     minorUnits: 100,
//     fullName: 'Суданский фунт',
// } as const;
// const SRD = {
//     code: 968,
//     mnemonicCode: 'SRD',
//     minorUnits: 100,
//     fullName: 'Суринамский доллар',
// } as const;
// const BDT = {
//     code: 50,
//     mnemonicCode: 'BDT',
//     minorUnits: 100,
//     fullName: 'Така',
// } as const;
// const WST = {
//     code: 882,
//     mnemonicCode: 'WST',
//     minorUnits: 100,
//     fullName: 'Тала',
// } as const;
// const TZS = {
//     code: 834,
//     mnemonicCode: 'TZS',
//     minorUnits: 100,
//     fullName: 'Танзанийский шиллинг',
// } as const;
// const KZT = {
//     code: 398,
//     mnemonicCode: 'KZT',
//     minorUnits: 100,
//     unicodeSymbol: '₸',
//     fullName: 'Тенге',
// } as const;
// const MNT = {
//     code: 496,
//     mnemonicCode: 'MNT',
//     minorUnits: 100,
//     unicodeSymbol: '₮',
//     fullName: 'Тугрик',
// } as const;
// const TND = {
//     code: 788,
//     mnemonicCode: 'TND',
//     minorUnits: 1000,
//     unicodeSymbol: 'د.ت',
//     fullName: 'Тунисский динар',
// } as const;
// const TRY = {
//     code: 949,
//     mnemonicCode: 'TRY',
//     minorUnits: 100,
//     unicodeSymbol: '₺',
//     fullName: 'Турецкая лира',
// } as const;
// const UGX = {
//     code: 800,
//     mnemonicCode: 'UGX',
//     minorUnits: 100,
//     unicodeSymbol: '₵',
//     fullName: 'Угандийский шиллинг',
// } as const;
// const MRU = {
//     code: 929,
//     mnemonicCode: 'MRU',
//     minorUnits: 100,
//     fullName: 'Угия',
// } as const;
// const UZS = {
//     code: 860,
//     mnemonicCode: 'UZS',
//     minorUnits: 100,
//     fullName: 'Узбекский сум',
// } as const;
// const UYU = {
//     code: 858,
//     mnemonicCode: 'UYU',
//     minorUnits: 100,
//     unicodeSymbol: '$',
//     fullName: 'Уругвайское песо',
// } as const;
// const UYI = {
//     code: 940,
//     mnemonicCode: 'UYI',
//     minorUnits: 100,
//     fullName: 'Уругвайское песо',
// } as const;
// const PHP = {
//     code: 608,
//     mnemonicCode: 'PHP',
//     minorUnits: 100,
//     unicodeSymbol: '₱',
//     fullName: 'Филиппинское песо',
// } as const;
// const HUF = {
//     code: 348,
//     mnemonicCode: 'HUF',
//     minorUnits: 100,
//     fullName: 'Форинт',
// } as const;
// const DJF = {
//     code: 262,
//     mnemonicCode: 'DJF',
//     minorUnits: 1,
//     fullName: 'Франк Джибути',
// } as const;
// const XAF = {
//     code: 950,
//     mnemonicCode: 'XAF',
//     minorUnits: 1,
//     fullName: 'Франк КФА ВЕАС',
// } as const;
// const XOF = {
//     code: 952,
//     mnemonicCode: 'XOF',
//     minorUnits: 1,
//     fullName: 'Франк КФА ВСЕАО',
// } as const;
// const XPF = {
//     code: 953,
//     mnemonicCode: 'XPF',
//     minorUnits: 1,
//     fullName: 'Франк КФП',
// } as const;
// const RWF = {
//     code: 646,
//     mnemonicCode: 'RWF',
//     minorUnits: 1,
//     fullName: 'Франк Руанды',
// } as const;
// const SHP = {
//     code: 654,
//     mnemonicCode: 'SHP',
//     minorUnits: 100,
//     fullName: 'Фунт Святой Елены',
// } as const;
// const GBP = {
//     code: 826,
//     mnemonicCode: 'GBP',
//     minorUnits: 100,
//     unicodeSymbol: '£',
//     fullName: 'Фунт стерлингов',
// } as const;
// const FKP = {
//     code: 238,
//     mnemonicCode: 'FKP',
//     minorUnits: 100,
//     unicodeSymbol: '£',
//     fullName: 'Фунт Фолклендских островов',
// } as const;
// const CZK = {
//     code: 203,
//     mnemonicCode: 'CZK',
//     minorUnits: 100,
//     unicodeSymbol: 'Kč',
//     fullName: 'Чешская крона',
// } as const;
// const CLP = {
//     code: 152,
//     mnemonicCode: 'CLP',
//     minorUnits: 1,
//     unicodeSymbol: '$',
//     fullName: 'Чилийское песо',
// } as const;
// const SEK = {
//     code: 752,
//     mnemonicCode: 'SEK',
//     minorUnits: 100,
//     fullName: 'Шведская крона',
// } as const;
// const CHF = {
//     code: 756,
//     mnemonicCode: 'CHF',
//     minorUnits: 100,
//     fullName: 'Швейцарский франк',
// } as const;
// const LKR = {
//     code: 144,
//     mnemonicCode: 'LKR',
//     minorUnits: 100,
//     fullName: 'Шри-ланкийская рупия',
// } as const;
// const CVE = {
//     code: 132,
//     mnemonicCode: 'CVE',
//     minorUnits: 100,
//     fullName: 'Эскудо Кабо-Верде',
// } as const;
// const ETB = {
//     code: 230,
//     mnemonicCode: 'ETB',
//     minorUnits: 100,
//     fullName: 'Эфиопский быр',
// } as const;
// const CNY = {
//     code: 156,
//     mnemonicCode: 'CNY',
//     minorUnits: 100,
//     unicodeSymbol: '¥',
//     fullName: 'Юань',
// } as const;
// const SSP = {
//     code: 728,
//     mnemonicCode: 'SSP',
//     minorUnits: 100,
//     unicodeSymbol: '£',
//     fullName: 'Южносуданский фунт',
// } as const;
// const JMD = {
//     code: 388,
//     mnemonicCode: 'JMD',
//     minorUnits: 100,
//     fullName: 'Ямайский доллар',
// } as const;
const CURRENCY = {
    // AUD: AUD,
    // AZN: AZN,
    // DZD: DZD,
    // ARS: ARS,
    // AMD: AMD,
    // AWG: AWG,
    // AFN: AFN,
    // BSD: BSD,
    // PAB: PAB,
    // BBD: BBD,
    // THB: THB,
    // BHD: BHD,
    // BZD: BZD,
    // BYN: BYN,
    // BMD: BMD,
    // BGN: BGN,
    // VED: VED,
    // VES: VES,
    // BOB: BOB,
    // BRL: BRL,
    // BND: BND,
    // BIF: BIF,
    // VUV: VUV,
    // KRW: KRW,
    // XCD: XCD,
    // GYD: GYD,
    // GNF: GNF,
    // GIP: GIP,
    // HKD: HKD,
    // UAH: UAH,
    // PYG: PYG,
    // HTG: HTG,
    // GMD: GMD,
    // DKK: DKK,
    // MKD: MKD,
    // AED: AED,
    // STN: STN,
    // ZWL: ZWL,
    // NAD: NAD,
    // KYD: KYD,
    // SBD: SBD,
    // USD: USD,
    // TTD: TTD,
    // FJD: FJD,
    // DOP: DOP,
    // VND: VND,
    // EUR: EUR,
    // EGP: EGP,
    // COU: COU,
    // ZMW: ZMW,
    // PLN: PLN,
    // NIO: NIO,
    // JPY: JPY,
    // INR: INR,
    // JOD: JOD,
    // IQD: IQD,
    // IRR: IRR,
    // ISK: ISK,
    // YER: YER,
    // CAD: CAD,
    // QAR: QAR,
    // AOA: AOA,
    // KES: KES,
    // GTQ: GTQ,
    // PGK: PGK,
    // COP: COP,
    // KMF: KMF,
    // BAM: BAM,
    // CUC: CUC,
    // CDF: CDF,
    // CRC: CRC,
    // CUP: CUP,
    // KWD: KWD,
    // HRK: HRK,
    // MMK: MMK,
    // LAK: LAK,
    // GEL: GEL,
    // ALL: ALL,
    // HNL: HNL,
    // SLE: SLE,
    // SLL: SLL,
    // LRD: LRD,
    // LBP: LBP,
    // LYD: LYD,
    // SZL: SZL,
    // LSL: LSL,
    // MUR: MUR,
    // MWK: MWK,
    // MGA: MGA,
    // MYR: MYR,
    // MAD: MAD,
    // MXN: MXN,
    // MZN: MZN,
    // MDL: MDL,
    // NGN: NGN,
    // ERN: ERN,
    // BTN: BTN,
    // NPR: NPR,
    // ANG: ANG,
    // NZD: NZD,
    // ILS: ILS,
    // TWD: TWD,
    // TMT: TMT,
    // NOK: NOK,
    // OMR: OMR,
    // TOP: TOP,
    // PKR: PKR,
    // MOP: MOP,
    // BWP: BWP,
    // KHR: KHR,
    // RUR: RUR,
    RUB: RUB,
    // RON: RON,
    // IDR: IDR,
    // MVR: MVR,
    // ZAR: ZAR,
    // SVC: SVC,
    // SAR: SAR,
    // KPW: KPW,
    // SCR: SCR,
    // RSD: RSD,
    // SGD: SGD,
    // SYP: SYP,
    // PEN: PEN,
    // KGS: KGS,
    // SOS: SOS,
    // TJS: TJS,
    // SDG: SDG,
    // SRD: SRD,
    // BDT: BDT,
    // WST: WST,
    // TZS: TZS,
    // KZT: KZT,
    // MNT: MNT,
    // TND: TND,
    // TRY: TRY,
    // UGX: UGX,
    // MRU: MRU,
    // UZS: UZS,
    // UYU: UYU,
    // UYI: UYI,
    // PHP: PHP,
    // HUF: HUF,
    // DJF: DJF,
    // XAF: XAF,
    // XOF: XOF,
    // XPF: XPF,
    // RWF: RWF,
    // SHP: SHP,
    // GBP: GBP,
    // FKP: FKP,
    // CZK: CZK,
    // CLP: CLP,
    // SEK: SEK,
    // CHF: CHF,
    // LKR: LKR,
    // CVE: CVE,
    // ETB: ETB,
    // CNY: CNY,
    // SSP: SSP,
    // JMD: JMD,
} as const;

export { CURRENCY, CURRENCY_SYMBOLS };