import { PaymentStatus } from './store';

interface OrderData {
    status: PaymentStatus;
    expireAt: number;
}

export class OrderStorage {
    private static readonly prefix = 'tx_';

    static save(id: number, order: OrderData): void {
        const key = this.prefix + id;
        localStorage.setItem(key, JSON.stringify(order));
    }

    static update(id: number, data: Partial<OrderData>): boolean {
        const existing = this.get(id);
        if (!existing) {
            return false;
        }
        const updated: OrderData = {
            status: data.status ?? existing.status,
            expireAt: data.expireAt ?? existing.expireAt,
        };
        this.save(id, updated);
        return true;
    }

    static get(id: number): OrderData | null {
        const key = this.prefix + id;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as OrderData;
        } catch {
            return null;
        }
    }

    static remove(id: number): void {
        const key = this.prefix + id;
        localStorage.removeItem(key);
    }

    static cleanupExpired(): number[] {
        const now = Date.now();
        const removed: number[] = [];
        for (const key of Object.keys(localStorage)) {
            if (!key.startsWith(this.prefix)) continue;
            const idStr = key.slice(this.prefix.length);
            const id = parseInt(idStr, 10);
            const data = this.get(id);
            if (!data) {
                this.remove(id);
                removed.push(id);
                continue;
            }
            let expireMs = data.expireAt;
            if (expireMs < 1e12) {
                expireMs *= 1000;
            }
            if (expireMs < now) {
                this.remove(id);
                removed.push(id);
            }
        }
        return removed;
    }
}

// export class OrderStorage {
//     private static readonly prefix = 'tx_';
//     private static readonly isCloud = isCloudStorageAvailable();

//     static async save(id: number, order: OrderData): Promise<void> {
//         const key = this.prefix + id;
//         const json = JSON.stringify(order);

//         if (this.isCloud) {
//             await this.setItemCloudStorage(key, json);
//         } else {
//             localStorage.setItem(key, json);
//         }
//     }

//     static async update(id: number, data: Partial<OrderData>): Promise<boolean> {
//         const existing = await this.get(id);
//         if (!existing) return false;
//         const updated: OrderData = {
//             status: data.status ?? existing.status,
//             expireAt: data.expireAt ?? existing.expireAt,
//         };
//         await this.save(id, updated);
//         return true;
//     }

//     static async get(id: number): Promise<OrderData | null> {
//         const key = this.prefix + id;
//         const raw = this.isCloud
//             ? await this.getItemCloudStorage(key)
//             : localStorage.getItem(key);
//         if (!raw) return null;
//         try {
//             return JSON.parse(raw) as OrderData;
//         } catch {
//             return null;
//         }
//     }

//     static async remove(id: number): Promise<void> {
//         const key = this.prefix + id;
//         if (this.isCloud) {
//             await this.removeItemCloudStorage(key);
//         } else {
//             localStorage.removeItem(key);
//         }
//     }

//     static async cleanupExpired(): Promise<number[]> {
//         const now = Date.now();
//         const removed: number[] = [];
//         const keys = this.isCloud
//             ? (await this.getKeysTelegramStorage()).filter(k => k.startsWith(this.prefix))
//             : Object.keys(localStorage).filter(k => k.startsWith(this.prefix));

//         for (const key of keys) {
//             const id = Number(key.slice(this.prefix.length));
//             const data = await this.get(id);
//             if (!data) {
//                 await this.remove(id);
//                 removed.push(id);
//                 continue;
//             }
//             let expireMs = data.expireAt < 1e12 ? data.expireAt * 1_000 : data.expireAt;
//             if (expireMs < now) {
//                 await this.remove(id);
//                 removed.push(id);
//             }
//         }
//         return removed;
//     }

//     private static setItemCloudStorage(key: string, value: string): Promise<void> {
//         return new Promise((resolve, reject) => {
//             CloudStorage.save(key, value, err => err ? reject(err) : resolve());
//         });
//     }
//     private static getItemCloudStorage(key: string): Promise<string | null> {
//         return new Promise((resolve, reject) => {
//             CloudStorage.get(key, (err, res) => err ? reject(err) : resolve(res ?? null));
//         });
//     }
//     private static removeItemCloudStorage(key: string): Promise<void> {
//         return this.setItemCloudStorage(key, '');
//     }
//     private static getKeysTelegramStorage(): Promise<string[]> {
//         return new Promise((resolve, reject) => {
//             CloudStorage.getKeys((err, keys) => err ? reject(err) : resolve(keys ?? []));
//         });
//     }
// }