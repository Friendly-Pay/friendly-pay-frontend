export const maskEmail = (
    email: string,
    visibleStart: number = 2,
    visibleEnd: number = 2
): string => {
    if (!email) return '';

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    const minLength = visibleStart + visibleEnd;
    if (localPart.length <= minLength) {
        return `${localPart}@${domain}`;
    }

    const firstChars = localPart.substring(0, visibleStart);
    const lastChars = localPart.substring(localPart.length - visibleEnd);

    return `${firstChars}${'•••'}${lastChars}@${domain}`;
};