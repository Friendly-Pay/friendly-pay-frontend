const TelegramCloudStorage = window.Telegram.WebApp.CloudStorage;

class UnsupportedCloudStorage {
    static warn() {
        console.warn('Ваша версия Telegram не поддерживает операции с облачным хранилищем.');
    }
    static save() {
        this.warn();
    }
    static get() {
        this.warn();
    }
}

class SupportedCloudStorage {
    static save(
        key: string,
        value: string,
        callback?: CloudStorageSetItemCallback
    ): void {
        TelegramCloudStorage.setItem(key, value, callback);
    }
    static get(
        key: string,
        callback?: CloudStorageGetItemCallback
    ): void {
        TelegramCloudStorage.getItem(key, callback);
    }
}

export const CloudStorage = window.Telegram.WebApp.isVersionAtLeast('6.9')
    ? SupportedCloudStorage
    : UnsupportedCloudStorage;

export const isCloudStorageAvailable = () => window.Telegram.WebApp.isVersionAtLeast('6.9');