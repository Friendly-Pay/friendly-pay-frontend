import { languageCodeToLocale } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { supportsNarrowCurrencyDisplay } from '@/utils';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './CardBalance.module.scss';

type CardBalanceProps = {
    value: string | number
    currency: string
    className?: string
}

// function lerp(current: number, target: number, factor: number) {
//     return current + (target - current) * factor;
// }

export function CardBalance({ value, currency, className }: CardBalanceProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const formattedCurrencyParts = Intl.NumberFormat(languageCodeToLocale(languageCode), {
        style: 'currency',
        currencyDisplay: supportsNarrowCurrencyDisplay() ? 'narrowSymbol' : 'symbol',
        currency: currency,
    }).formatToParts(typeof value === 'string' ? parseFloat(value) : value);

    // const targetOpacityRef = useRef(1);
    // const targetScaleRef = useRef(1);
    // const currentOpacityRef = useRef(1);
    // const currentScaleRef = useRef(1);
    // const rAFRef = useRef<number | null>(null);
    // useEffect(() => {
    //     const pageHead = document.getElementById('pageHead');
    //     const mainLayout = document.getElementById('mainLayout');
    //     if (!pageHead || !mainLayout) return;

    //     const animate = () => {
    //         currentOpacityRef.current = lerp(currentOpacityRef.current, targetOpacityRef.current, 0.15);
    //         currentScaleRef.current = lerp(currentScaleRef.current, targetScaleRef.current, 0.15);
    //         if (textRef.current) {
    //             textRef.current.style.opacity = String(currentOpacityRef.current);
    //         }
    //         if (balanceRef.current) {
    //             balanceRef.current.style.transform = `scale(${currentScaleRef.current})`;
    //         }
    //         rAFRef.current = requestAnimationFrame(animate);
    //     };

    //     rAFRef.current = requestAnimationFrame(animate);

    //     const headRect = pageHead.getBoundingClientRect();
    //     const handleScroll = () => {
    //         if (!textRef.current || !balanceRef.current) return;

    //         const textRect = textRef.current.getBoundingClientRect();
    //         const balanceRect = balanceRef.current.getBoundingClientRect();

    //         const textHeight = textRect.height;
    //         const scrollDistance = headRect.bottom - textRect.top;

    //         let newOpacity = 1;
    //         if (scrollDistance <= textHeight) {
    //             newOpacity = 1 - scrollDistance / textHeight;
    //         } else {
    //             newOpacity = 0;
    //         }
    //         targetOpacityRef.current = newOpacity;

    //         let scale = 1;
    //         const balanceDistance = balanceRect.top - headRect.bottom;
    //         if (balanceDistance <= 10) {
    //             // Допустим, когда центры совпадают, scale должен быть targetScale
    //             const headCenter = headRect.top + headRect.height / 2;
    //             const balanceCenter = (balanceRect.top + balanceRect.bottom) / 2;

    //             const centerY = Math.abs(headCenter - balanceCenter);
    //             const balanceHeight = balanceRect.height;

    //             const progress = 1 - Math.min(centerY / balanceHeight, 1);

    //             const targetScale = 19 / 45;
    //             scale = 1 - (1 - targetScale) * progress;
    //         }
    //         targetScaleRef.current = scale;
    //     };

    //     mainLayout.addEventListener('scroll', handleScroll, { passive: true });
    //     return () => {
    //         mainLayout.removeEventListener('scroll', handleScroll);
    //         if (rAFRef.current) {
    //             cancelAnimationFrame(rAFRef.current);
    //         }
    //     };
    // }, []);

    return (
        <div className={classNames(styles.root, className)}>
            <Text
                type='caption'
                weight='regular'
                align='center'
                className={styles.text}
            >
                {t('Card balance')}
            </Text>

            <div
                id='balance'
                className={styles.balance}
            >
                {formattedCurrencyParts.map((part, index) => (
                    <span
                        key={index}
                        className={styles[part.type]}
                    >
                        {part.value}
                    </span>
                ))}
            </div>
        </div>
    );
}