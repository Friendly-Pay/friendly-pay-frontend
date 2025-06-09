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