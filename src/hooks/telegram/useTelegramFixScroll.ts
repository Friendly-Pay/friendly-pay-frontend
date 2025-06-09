import { useEffect } from 'react';

const MIN_SUPPORTED_TELEGRAM_VERSION = '7.7';

export const useTelegramFixScroll = () => {
    useEffect(() => {
        const isAndroid = navigator.userAgent.toLowerCase().includes('android');
        const isIOS = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
            || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

        if (window.Telegram && !window.Telegram.WebApp.isVersionAtLeast(MIN_SUPPORTED_TELEGRAM_VERSION)) {
            if (isAndroid) {
                document.body.style.overflowY = 'hidden';
                document.body.style.marginTop = '100px';
                document.body.style.height = window.innerHeight + 100 + 'px';
                document.body.style.paddingBottom = '100px';
                setTimeout(() => {
                    window.scrollTo(0, 100);
                }, 1);

                const handleBodyScroll = () => {
                    document.body.scrollTop = 100;
                    setTimeout(() => {
                        window.scrollTo(0, 100);
                    }, 1);
                };
                const handleWindowScroll = () => {
                    document.body.scrollTop = 100;
                    setTimeout(() => {
                        window.scrollTo(0, 100);
                    }, 1);
                };
                window.addEventListener('scroll', handleWindowScroll);
                document.body.addEventListener('scroll', handleBodyScroll);
                return () => {
                    window.removeEventListener('scroll', handleWindowScroll);
                    document.body.removeEventListener('scroll', handleBodyScroll);
                };
            }

            if (isIOS) {
                let initialTouchY: number | null = null;

                const handleTouchStart = (event: TouchEvent) => {
                    initialTouchY = event.touches[0].clientY;
                };

                const handleTouchMove = (event: TouchEvent) => {
                    let hasScrollableParent = false;
                    let currentElement = event.target as HTMLElement | null;
                    while (currentElement && currentElement.id !== 'root') {
                        if (currentElement.scrollHeight > currentElement.clientHeight) {
                            hasScrollableParent = true;
                            break;
                        }
                        currentElement = currentElement.parentElement;
                    }
                    if (hasScrollableParent && currentElement) {
                        const scrollTop = currentElement.scrollTop;
                        const currentTouchY = event.changedTouches[0].clientY;
                        if (scrollTop <= 0 && initialTouchY !== null && initialTouchY < currentTouchY && event.cancelable) {
                            event.preventDefault();
                        }
                    } else {
                        event.preventDefault();
                    }
                };
                document.documentElement.addEventListener('touchstart', handleTouchStart, { passive: false });
                document.documentElement.addEventListener('touchmove', handleTouchMove, { passive: false });
                return () => {
                    document.documentElement.removeEventListener('touchstart', handleTouchStart);
                    document.documentElement.removeEventListener('touchmove', handleTouchMove);
                };
            }
        }
    }, []);
};