export type CountryRaw = [
    /** Английское название страны — используется для поиска и внутренней логики */
    string,

    /** Русское название страны — используется в UI */
    string,

    /** ISO 3166-1 alpha-2 код в нижнем регистре (например: "ru", "us") */
    string,

    /** ISO 3166-1 alpha-3 код в верхнем регистре (например: "RUS", "USA") */
    string,

    /** Международный телефонный код без "+" (например: "7", "1") */
    string,

    /**
     * Необязательный приоритет для стран,
     * которые используют один и тот же телефонный код.
     *
     * 0 — стандартный, чем выше число — тем ниже приоритет в списке.
     * Пример: +61 используется Австралией и её территориями.
     */
    number?,

    /**
     * Необязательный список локальных кодов регионов,
     * используемых вместе с телефонным кодом.
     *
     * Например, страны в системе NANP: США, Канада,
     * государства Карибского бассейна и т.д.
     */
    string[]?,
];

export interface Country {
    /** Английское название страны — используется для поиска и внутренней логики */
    name: string;
    /** Русское название страны — используется в UI */
    nameRu: string;
    /** ISO 3166-1 alpha-2 код в нижнем регистре (например: "ru", "us") */
    iso2: string;
    /** ISO 3166-1 alpha-3 код в верхнем регистре (например: "RUS", "USA") */
    iso3: string;
    /** Международный телефонный код без "+" (например: "7", "1") */
    dialCode: string;
    /** Приоритет для стран с одинаковым телефонным кодом */
    priority: number | null;
    /** Список локальных кодов регионов */
    areaCodes: string[] | null;
}

export const countries: CountryRaw[] = [
    ['Afghanistan', 'Афганистан', 'af', 'AFG', '93'],
    ['Albania', 'Албания', 'al', 'ALB', '355'],
    ['Algeria', 'Алжир', 'dz', 'DZA', '213'],
    ['American Samoa', 'Американское Самоа', 'as', 'ASM', '1684'],
    ['Andorra', 'Андорра', 'ad', 'AND', '376'],
    ['Angola', 'Ангола', 'ao', 'AGO', '244'],
    ['Anguilla', 'Ангилья', 'ai', 'AIA', '1264'],
    ['Antigua and Barbuda', 'Антигуа и Барбуда', 'ag', 'ATG', '1268'],
    ['Argentina', 'Аргентина', 'ar', 'ARG', '54'],
    ['Armenia', 'Армения', 'am', 'ARM', '374'],
    ['Aruba', 'Аруба', 'aw', 'ABW', '297'],
    ['Australia', 'Австралия', 'au', 'AUS', '61', 0],
    ['Austria', 'Австрия', 'at', 'AUT', '43'],
    ['Azerbaijan', 'Азербайджан', 'az', 'AZE', '994'],
    ['Bahamas', 'Багамские Острова', 'bs', 'BHS', '1242'],
    ['Bahrain', 'Бахрейн', 'bh', 'BHR', '973'],
    ['Bangladesh', 'Бангладеш', 'bd', 'BGD', '880'],
    ['Barbados', 'Барбадос', 'bb', 'BRB', '1246'],
    ['Belarus', 'Беларусь', 'by', 'BLR', '375'],
    ['Belgium', 'Бельгия', 'be', 'BEL', '32'],
    ['Belize', 'Белиз', 'bz', 'BLZ', '501'],
    ['Benin', 'Бенин', 'bj', 'BEN', '229'],
    ['Bermuda', 'Бермудские Острова', 'bm', 'BMU', '1441'],
    ['Bhutan', 'Бутан', 'bt', 'BTN', '975'],
    ['Bolivia', 'Боливия', 'bo', 'BOL', '591'],
    ['Bosnia and Herzegovina', 'Босния и Герцеговина', 'ba', 'BIH', '387'],
    ['Botswana', 'Ботсвана', 'bw', 'BWA', '267'],
    ['Brazil', 'Бразилия', 'br', 'BRA', '55'],
    ['British Indian Ocean Territory', 'Брит. Терр. в Индийском Океане', 'io', 'IOT', '246'],
    ['British Virgin Islands', 'Британские Виргинские Острова', 'vg', 'VGB', '1284'],
    ['Brunei', 'Бруней', 'bn', 'BRN', '673'],
    ['Bulgaria', 'Болгария', 'bg', 'BGR', '359'],
    ['Burkina Faso', 'Буркина-Фасо', 'bf', 'BFA', '226'],
    ['Burundi', 'Бурунди', 'bi', 'BDI', '257'],
    ['Cambodia', 'Камбоджа', 'kh', 'KHM', '855'],
    ['Cameroon', 'Камерун', 'cm', 'CMR', '237'],
    [
        'Canada',
        'Канада',
        'ca',
        'CAN',
        '1',
        1,
        [
            '204',
            '226',
            '236',
            '249',
            '250',
            '289',
            '306',
            '343',
            '365',
            '387',
            '403',
            '416',
            '418',
            '431',
            '437',
            '438',
            '450',
            '506',
            '514',
            '519',
            '548',
            '579',
            '581',
            '587',
            '604',
            '613',
            '639',
            '647',
            '672',
            '705',
            '709',
            '742',
            '778',
            '780',
            '782',
            '807',
            '819',
            '825',
            '867',
            '873',
            '902',
            '905',
        ],
    ],
    ['Cape Verde', 'Кабо-Верде', 'cv', 'CPV', '238'],
    ['Caribbean Netherlands', 'Карибские Нидерланды', 'bq', 'BES', '599', 1],
    ['Cayman Islands', 'Каймановы Острова', 'ky', 'CYM', '1345'],
    ['Central African Republic', 'ЦАР', 'cf', 'CAF', '236'],
    ['Chad', 'Чад', 'td', 'TCD', '235'],
    ['Chile', 'Чили', 'cl', 'CHL', '56'],
    ['China', 'Китайская Народная Республика', 'cn', 'CHN', '86'],
    ['Christmas Island (Australia)', 'Остров Рождества', 'cx', 'CXR', '61', 2],
    ['Cocos (Keeling) Islands', 'Кокосовые Острова', 'cc', 'CCK', '61', 1],
    ['Colombia', 'Колумбия', 'co', 'COL', '57'],
    ['Comoros', 'Коморские Острова', 'km', 'COM', '269'],
    ['Congo (DRC)', 'Демократическая Республика Конго', 'cd', 'COD', '243'],
    ['Congo (Republic)', 'Республика Конго', 'cg', 'COG', '242'],
    ['Cook Islands', 'Острова Кука', 'ck', 'COK', '682'],
    ['Costa Rica', 'Коста-Рика', 'cr', 'CRI', '506'],
    ['Côte d’Ivoire', 'Кот-д’Ивуар', 'ci', 'CIV', '225'],
    ['Croatia', 'Хорватия', 'hr', 'HRV', '385'],
    ['Cuba', 'Куба', 'cu', 'CUB', '53'],
    ['Curaçao', 'Кюрасао', 'cw', 'CUW', '599', 0],
    ['Cyprus', 'Кипр', 'cy', 'CYP', '357'],
    ['Czech Republic', 'Чехия', 'cz', 'CZE', '420'],
    ['Denmark', 'Дания', 'dk', 'DNK', '45'],
    ['Djibouti', 'Джибути', 'dj', 'DJI', '253'],
    ['Dominica', 'Доминика', 'dm', 'DMA', '1767'],
    ['Dominican Republic', 'Доминиканская Республика', 'do', 'DOM', '1', 2, ['809', '829', '849']],
    ['Ecuador', 'Эквадор', 'ec', 'ECU', '593'],
    ['Egypt', 'Египет', 'eg', 'EGY', '20'],
    ['El Salvador', 'Сальвадор', 'sv', 'SLV', '503'],
    ['Equatorial Guinea', 'Экваториальная Гвинея', 'gq', 'GNQ', '240'],
    ['Eritrea', 'Эритрея', 'er', 'ERI', '291'],
    ['Estonia', 'Эстония', 'ee', 'EST', '372'],
    ['Ethiopia', 'Эфиопия', 'et', 'ETH', '251'],
    ['Falkland Islands', 'Фолклендские Острова', 'fk', 'FLK', '500'],
    ['Faroe Islands', 'Фарерские Острова', 'fo', 'FRO', '298'],
    ['Fiji', 'Фиджи', 'fj', 'FJI', '679'],
    ['Finland', 'Финляндия', 'fi', 'FIN', '358', 0],
    ['France', 'Франция', 'fr', 'FRA', '33'],
    ['French Guiana', 'Гвиана Французская', 'gf', 'GUF', '594'],
    ['French Polynesia', 'Полинезия Французская', 'pf', 'PYF', '689'],
    ['Gabon', 'Габон', 'ga', 'GAB', '241'],
    ['Gambia', 'Гамбия', 'gm', 'GMB', '220'],
    ['Georgia', 'Грузия', 'ge', 'GEO', '995'],
    ['Germany', 'Германия', 'de', 'DEU', '49'],
    ['Ghana', 'Гана', 'gh', 'GHA', '233'],
    ['Gibraltar', 'Гибралтар', 'gi', 'GIB', '350'],
    ['Greece', 'Греция', 'gr', 'GRC', '30'],
    ['Greenland', 'Гренландия', 'gl', 'GRL', '299'],
    ['Grenada', 'Гренада', 'gd', 'GRD', '1473'],
    ['Guadeloupe', 'Гваделупа', 'gp', 'GLP', '590', 0],
    ['Guam', 'Гуам', 'gu', 'GUM', '1671'],
    ['Guatemala', 'Гватемала', 'gt', 'GTM', '502'],
    ['Guernsey', 'Гернси', 'gg', 'GGY', '44', 1],
    ['Guinea', 'Гвинея', 'gn', 'GIN', '224'],
    ['Guinea-Bissau', 'Гвинея-Бисау', 'gw', 'GNB', '245'],
    ['Guyana', 'Гайана', 'gy', 'GUY', '592'],
    ['Haiti', 'Гаити', 'ht', 'HTI', '509'],
    ['Honduras', 'Гондурас', 'hn', 'HND', '504'],
    ['Hong Kong', 'Гонконг', 'hk', 'HKG', '852'],
    ['Hungary', 'Венгрия', 'hu', 'HUN', '36'],
    ['Iceland', 'Исландия', 'is', 'ISL', '354'],
    ['India', 'Индия', 'in', 'IND', '91'],
    ['Indonesia', 'Индонезия', 'id', 'IDN', '62'],
    ['Iran', 'Иран', 'ir', 'IRN', '98'],
    ['Iraq', 'Ирак', 'iq', 'IRQ', '964'],
    ['Ireland', 'Ирландия', 'ie', 'IRL', '353'],
    ['Isle of Man', 'Остров Мэн', 'im', 'IMN', '44', 2],
    ['Israel', 'Израиль', 'il', 'ISR', '972'],
    ['Italy', 'Италия', 'it', 'ITA', '39', 0],
    ['Jamaica', 'Ямайка', 'jm', 'JAM', '1876'],
    ['Japan', 'Япония', 'jp', 'JPN', '81'],
    ['Jersey', 'Джерси', 'je', 'JEY', '44', 3],
    ['Jordan', 'Иордания', 'jo', 'JOR', '962'],
    ['Kazakhstan', 'Казахстан', 'kz', 'KAZ', '7', 1],
    ['Kenya', 'Кения', 'ke', 'KEN', '254'],
    ['Kiribati', 'Кирибати', 'ki', 'KIR', '686'],
    ['Kosovo', 'Косово', 'xk', 'XKX', '383'],
    ['Kuwait', 'Кувейт', 'kw', 'KWT', '965'],
    ['Kyrgyzstan', 'Киргизия', 'kg', 'KGZ', '996'],
    ['Laos', 'Лаос', 'la', 'LAO', '856'],
    ['Latvia', 'Латвия', 'lv', 'LVA', '371'],
    ['Lebanon', 'Ливан', 'lb', 'LBN', '961'],
    ['Lesotho', 'Лесото', 'ls', 'LSO', '266'],
    ['Liberia', 'Либерия', 'lr', 'LBR', '231'],
    ['Libya', 'Ливия', 'ly', 'LBY', '218'],
    ['Liechtenstein', 'Лихтенштейн', 'li', 'LIE', '423'],
    ['Lithuania', 'Литва', 'lt', 'LTU', '370'],
    ['Luxembourg', 'Люксембург', 'lu', 'LUX', '352'],
    ['Macau', 'Макао', 'mo', 'MAC', '853'],
    ['Macedonia', 'Македония', 'mk', 'MKD', '389'],
    ['Madagascar', 'Мадагаскар', 'mg', 'MDG', '261'],
    ['Malawi', 'Малави', 'mw', 'MWI', '265'],
    ['Malaysia', 'Малайзия', 'my', 'MYS', '60'],
    ['Maldives', 'Мальдивы', 'mv', 'MDV', '960'],
    ['Mali', 'Мали', 'ml', 'MLI', '223'],
    ['Malta', 'Мальта', 'mt', 'MLT', '356'],
    ['Marshall Islands', 'Маршалловы Острова', 'mh', 'MHL', '692'],
    ['Martinique', 'Мартиника', 'mq', 'MTQ', '596'],
    ['Mauritania', 'Мавритания', 'mr', 'MRT', '222'],
    ['Mauritius', 'Маврикий', 'mu', 'MUS', '230'],
    ['Mayotte', 'Майотта', 'yt', 'MYT', '262', 1],
    ['Mexico', 'Мексика', 'mx', 'MEX', '52'],
    ['Micronesia', 'Микронезия', 'fm', 'FSM', '691'],
    ['Moldova', 'Молдавия', 'md', 'MDA', '373'],
    ['Monaco', 'Монако', 'mc', 'MCO', '377'],
    ['Mongolia', 'Монголия', 'mn', 'MNG', '976'],
    ['Montenegro', 'Черногория', 'me', 'MNE', '382'],
    ['Montserrat', 'Монтсеррат', 'ms', 'MSR', '1664'],
    ['Morocco', 'Марокко', 'ma', 'MAR', '212', 0],
    ['Mozambique', 'Мозамбик', 'mz', 'MOZ', '258'],
    ['Myanmar', 'Мьянма', 'mm', 'MMR', '95'],
    ['Namibia', 'Намибия', 'na', 'NAM', '264'],
    ['Nauru', 'Науру', 'nr', 'NRU', '674'],
    ['Nepal', 'Непал', 'np', 'NPL', '977'],
    ['Netherlands', 'Нидерланды', 'nl', 'NLD', '31'],
    ['New Caledonia', 'Новая Каледония', 'nc', 'NCL', '687'],
    ['New Zealand', 'Новая Зеландия', 'nz', 'NZL', '64'],
    ['Nicaragua', 'Никарагуа', 'ni', 'NIC', '505'],
    ['Niger', 'Нигер', 'ne', 'NER', '227'],
    ['Nigeria', 'Нигерия', 'ng', 'NGA', '234'],
    ['Niue', 'Ниуэ', 'nu', 'NIU', '683'],
    ['Norfolk Island', 'Остров Норфолк', 'nf', 'NFK', '672'],
    ['North Korea', 'Северная Корея', 'kp', 'PRK', '850'],
    ['Northern Mariana Islands', 'Северные Марианские Острова', 'mp', 'MNP', '1670'],
    ['Norway', 'Норвегия', 'no', 'NOR', '47', 0],
    ['Oman', 'Оман', 'om', 'OMN', '968'],
    ['Pakistan', 'Пакистан', 'pk', 'PAK', '92'],
    ['Palau', 'Палау', 'pw', 'PLW', '680'],
    ['Palestine', 'Палестина', 'ps', 'PSE', '970'],
    ['Panama', 'Панама', 'pa', 'PAN', '507'],
    ['Papua New Guinea', 'Папуа — Новая Гвинея', 'pg', 'PNG', '675'],
    ['Paraguay', 'Парагвай', 'py', 'PRY', '595'],
    ['Peru', 'Перу', 'pe', 'PER', '51'],
    ['Philippines', 'Филиппины', 'ph', 'PHL', '63'],
    ['Poland', 'Польша', 'pl', 'POL', '48'],
    ['Portugal', 'Португалия', 'pt', 'PRT', '351'],
    ['Puerto Rico', 'Пуэрто-Рико', 'pr', 'PRI', '1', 3, ['787', '939']],
    ['Qatar', 'Катар', 'qa', 'QAT', '974'],
    ['Réunion', 'Реюньон', 're', 'REU', '262', 0],
    ['Romania', 'Румыния', 'ro', 'ROU', '40'],
    ['Russia', 'Россия', 'ru', 'RUS', '7', 0],
    ['Rwanda', 'Руанда', 'rw', 'RWA', '250'],
    ['Saint Barthélemy', 'Сен-Бартелеми', 'bl', 'BLM', '590', 1],
    ['Saint Helena', 'Остров Святой Елены', 'sh', 'SHN', '290'],
    ['Saint Kitts and Nevis', 'Сент-Китс и Невис', 'kn', 'KNA', '1869'],
    ['Saint Lucia', 'Сент-Люсия', 'lc', 'LCA', '1758'],
    ['Saint Martin', 'Сен-Мартен', 'mf', 'MAF', '590', 2],
    ['Saint Pierre and Miquelon', 'Сен-Пьер и Микелон', 'pm', 'SPM', '508'],
    ['Saint Vincent and the Grenadines', 'Сент-Винсент и Гренадины', 'vc', 'VCT', '1784'],
    ['Samoa', 'Самоа', 'ws', 'WSM', '685'],
    ['San Marino', 'Сан-Марино', 'sm', 'SMR', '378'],
    ['São Tomé and Príncipe', 'Сан-Томе и Принсипи', 'st', 'STP', '239'],
    ['Saudi Arabia', 'Саудовская Аравия', 'sa', 'SAU', '966'],
    ['Senegal', 'Сенегал', 'sn', 'SEN', '221'],
    ['Serbia', 'Сербия', 'rs', 'SRB', '381'],
    ['Seychelles', 'Сейшельские Острова', 'sc', 'SYC', '248'],
    ['Sierra Leone', 'Сьерра-Леоне', 'sl', 'SLE', '232'],
    ['Singapore', 'Сингапур', 'sg', 'SGP', '65'],
    ['Sint Maarten', 'Синт-Мартен', 'sx', 'SXM', '1721'],
    ['Slovakia', 'Словакия', 'sk', 'SVK', '421'],
    ['Slovenia', 'Словения', 'si', 'SVN', '386'],
    ['Solomon Islands', 'Соломоновы Острова', 'sb', 'SLB', '677'],
    ['Somalia', 'Сомали', 'so', 'SOM', '252'],
    ['South Africa', 'ЮАР', 'za', 'ZAF', '27'],
    ['South Korea', 'Южная Корея', 'kr', 'KOR', '82'],
    ['South Sudan', 'Южный Судан', 'ss', 'SSD', '211'],
    ['Spain', 'Испания', 'es', 'ESP', '34'],
    ['Sri Lanka', 'Шри-Ланка', 'lk', 'LKA', '94'],
    ['Sudan', 'Судан', 'sd', 'SDN', '249'],
    ['Suriname', 'Суринам', 'sr', 'SUR', '597'],
    ['Svalbard and Jan Mayen', 'Шпицберген и Ян-Майен', 'sj', 'SJM', '47', 1],
    ['Swaziland', 'Свазиленд', 'sz', 'SWZ', '268'],
    ['Sweden', 'Швеция', 'se', 'SWE', '46'],
    ['Switzerland', 'Швейцария', 'ch', 'CHE', '41'],
    ['Syria', 'Сирия', 'sy', 'SYR', '963'],
    ['Taiwan', 'Тайвань', 'tw', 'TWN', '886'],
    ['Tajikistan', 'Таджикистан', 'tj', 'TJK', '992'],
    ['Tanzania', 'Танзания', 'tz', 'TZA', '255'],
    ['Thailand', 'Таиланд', 'th', 'THA', '66'],
    ['Timor-Leste', 'Восточный Тимор', 'tl', 'TLS', '670'],
    ['Togo', 'Того', 'tg', 'TGO', '228'],
    ['Tokelau', 'Токелау', 'tk', 'TKL', '690'],
    ['Tonga', 'Тонга', 'to', 'TON', '676'],
    ['Trinidad and Tobago', 'Тринидад и Тобаго', 'tt', 'TTO', '1868'],
    ['Tunisia', 'Тунис', 'tn', 'TUN', '216'],
    ['Turkey', 'Турция', 'tr', 'TUR', '90'],
    ['Turkmenistan', 'Туркмения', 'tm', 'TKM', '993'],
    ['Turks and Caicos Islands', 'Тёркс и Кайкос', 'tc', 'TCA', '1649'],
    ['Tuvalu', 'Тувалу', 'tv', 'TUV', '688'],
    ['U.S. Virgin Islands', 'Американские Виргинские Острова', 'vi', 'VIR', '1340'],
    ['Uganda', 'Уганда', 'ug', 'UGA', '256'],
    ['Ukraine', 'Украина', 'ua', 'UKR', '380'],
    ['United Arab Emirates', 'ОАЭ', 'ae', 'ARE', '971'],
    ['United Kingdom', 'Великобритания', 'gb', 'GBR', '44', 0],
    ['United States', 'США', 'us', 'USA', '1', 0],
    ['Uruguay', 'Уругвай', 'uy', 'URY', '598'],
    ['Uzbekistan', 'Узбекистан', 'uz', 'UZB', '998'],
    ['Vanuatu', 'Вануату', 'vu', 'VUT', '678'],
    ['Vatican City', 'Ватикан', 'va', 'VAT', '39', 1],
    ['Venezuela', 'Венесуэла', 've', 'VEN', '58'],
    ['Vietnam', 'Вьетнам', 'vn', 'VNM', '84'],
    ['Wallis and Futuna', 'Уоллис и Футуна', 'wf', 'WLF', '681'],
    ['Western Sahara', 'Западная Сахара', 'eh', 'ESH', '212', 1],
    ['Yemen', 'Йемен', 'ye', 'YEM', '967'],
    ['Zambia', 'Замбия', 'zm', 'ZMB', '260'],
    ['Zimbabwe', 'Зимбабве', 'zw', 'ZWE', '263'],
    ['Åland Islands', 'Аландские Острова', 'ax', 'ALA', '358', 1],
] as const;

/**
 * Форматирует сырые данные страны в структурированный объект
 */
export const formatCountry = (country: CountryRaw): Country => {
    const [
        name,
        nameRu,
        iso2,
        iso3,
        dialCode,
        priority,
        areaCodes
    ] = country;

    return {
        name,
        nameRu,
        iso2,
        iso3,
        dialCode,
        priority: priority ?? null,
        areaCodes: areaCodes ?? null,
    };
};

/**
 * Возвращает отсортированный список всех стран
 */
export const getCountries = (countries: CountryRaw[]): Country[] => {
    return countries
        .map(formatCountry)
        .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Возвращает хэш стран, где ключ - iso3 код страны
 */
export const getCountriesHash = (countries: CountryRaw[]): Record<string, Country> => {
    return countries.reduce((acc, country) => {
        const formatted = formatCountry(country);
        acc[formatted.iso3] = formatted;
        return acc;
    }, {} as Record<string, Country>);
};

