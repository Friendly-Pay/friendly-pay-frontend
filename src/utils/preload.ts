const domImageCache = new Map<string, Promise<HTMLImageElement>>();

export const loadDomImage = (
    src: string,
    crossOrigin: '' | 'anonymous' | 'use-credentials' = 'anonymous',
): Promise<HTMLImageElement> => {
    if (domImageCache.has(src)) return domImageCache.get(src)!;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.crossOrigin = crossOrigin;
        img.src = src;

        img.onload = () => {
            img.onload = null;
            img.onerror = null;
            if ('decode' in img) {
                img.decode()
                    .then(() => resolve(img))
                    .catch(reject);
            } else {
                resolve(img);
            }
        };
        img.onerror = () => {
            img.onload = null;
            img.onerror = null;
            reject(new Error(`[loadDomImage] Can't load ${src}`));
        };
    });
    domImageCache.set(src, promise);
    return promise;
};
