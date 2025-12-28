const SANCTIONED_DOMAINS = new Set([
    'af',
    'by',
    'mm',
    'cf',
    'cn',
    'cu',
    'cd',
    'et',
    'hk',
    'ir',
    'iq',
    'lb',
    'ly',
    'ml',
    'ni',
    'kp',
    'ru',
    'so',
    'ss',
    'sd',
    'sy',
    've',
    'ye'
]);

export const isSanctionEmail = (email: string) => {
    if (!email || email.length > 320) return false;
    const atPos = email.lastIndexOf('@');
    if (atPos < 1 || atPos === email.length - 1) return false;

    const rawDomain = email.slice(atPos + 1).trim().toLowerCase();
    const labels = rawDomain.split('.');
    if (labels.length < 2) return false;
    const tld = labels[labels.length - 1];

    return SANCTIONED_DOMAINS.has(tld);
};


const EMAIL_PARTS_SEPARATOR = '@';
const DOMAIN_PARTS_SEPARATOR = '.';
const MAX_ACCOUNT_LENGTH = 64;
const MAX_ADDRESS_LENGTH = 255;
const MAX_DOMAIN_LENGTH = 63;
const EMAIL_REGEX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 * Возвращает true для валидного email, иначе false
 * @param email - Строка содержащая email
 */
export const isValidEmail = (email: string | null | undefined): boolean => {
    if (!email) return false;

    const emailParts = email.split(EMAIL_PARTS_SEPARATOR);
    if (emailParts.length !== 2) return false;

    const [account, address] = emailParts;

    if (account.length > MAX_ACCOUNT_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return false;
    }

    const domainParts = address.split(DOMAIN_PARTS_SEPARATOR);
    const domainTooLong = domainParts.some(part => part.length > MAX_DOMAIN_LENGTH);
    if (domainTooLong) return false;

    return EMAIL_REGEX.test(email);
};
