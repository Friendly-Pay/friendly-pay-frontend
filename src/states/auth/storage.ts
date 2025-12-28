export class ReferralStorage {
    private static readonly STORAGE_KEY = 'referralId';

    static get(): string | null {
        const referralId = ReferralStorage.getValid();
        return referralId;
    }

    static set(referralId: string): void {
        sessionStorage.setItem(this.STORAGE_KEY, referralId);
    }

    static clear(): void {
        sessionStorage.removeItem(this.STORAGE_KEY);
    }

    private static getValid(): string | null {
        const referralId = sessionStorage.getItem(this.STORAGE_KEY);
        if (referralId && referralId.trim().length >= 1) {
            return referralId.trim();
        }
        return null;
    }
}