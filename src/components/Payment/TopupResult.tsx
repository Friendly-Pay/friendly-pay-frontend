import { FormattedAmount } from '../Amount/FormattedAmount';
import { CenteredContent } from '../Layout/CenteredContent';
import { CURRENCY } from '@/states/currency/currency';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { formatAmount } from '@/utils/format';
import { toMinorUnits } from '@/utils/math';
import successBlur from 'assets/topup-blur.png';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopupResult.module.scss';

type TopupResultProps = {
    cardNumber: string
    receivedAmount: number | null | undefined
    receivedAmountFee: number | null | undefined
    currencyId: string;
    currencyCode: string;
    currencyImage: string;
    currencyMinority: number;
    /** Показать основную кнопку после завершения анимации */
    onShowMainButton: () => void
}

const animationInitials = {
    currency: { scale: 1.2 },
    blur: { scale: 0.0911062906, opacity: 0.5 },
    content: { opacity: 0 }
};

const animationConfig = {
    currency: {
        scale: [1.2, 1],
        transition: {
            type: 'spring',
            stiffness: 380,
            damping: 16,
            mass: 0.7
        }
    },
    blur: {
        scale: 1.4,
        opacity: 0,
        transition: {
            scale: {
                type: 'spring',
                stiffness: 140,
                damping: 36,
                mass: 0.8,
            },
            opacity: {
                duration: 0.5,
                ease: 'easeOut'
            },
        },
    },
    content: {
        opacity: 1,
        transition: {
            opacity: {
                duration: 0.3,
                delay: 0.4,
                ease: 'easeOut'
            },
        }
    }
};

const SBP_IMAGE_STYLES = {
    backgroundColor: 'var(--color-background)',
    borderRadius: '50%',
    overflow: 'hidden'
};

export const TOPUP_BLUR_IMAGE = successBlur;

export function TopupResult({ cardNumber, currencyId, currencyCode, currencyImage, currencyMinority, receivedAmount, receivedAmountFee, onShowMainButton }: TopupResultProps) {
    const [t] = useTranslation();
    const locale = useUserStore(state => state.languageCode);

    const blurControls = useAnimationControls();
    const currencyIconControls = useAnimationControls();
    const contentControls = useAnimationControls();

    const timerId = useRef(0);
    const isMounted = useRef(false);

    const clearTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            clearTimer();
        };
    }, []);

    useLayoutEffect(() => {
        const timerId = setTimeout(() => {
            handleAppearanceAnimation();
        }, 150);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    const handleAppearanceAnimation = async () => {
        if (!isMounted.current) return;

        currencyIconControls.stop();
        currencyIconControls.start(animationConfig.currency);

        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');

        clearTimer();
        timerId.current = setTimeout(async () => {
            if (!isMounted.current) return;

            blurControls.stop();
            contentControls.stop();

            await Promise.all([
                blurControls.start(animationConfig.blur),
                contentControls.start(animationConfig.content)
            ]);

            if (!isMounted.current) return;

            onShowMainButton();
        }, 200);
    };

    return (
        <CenteredContent>
            <motion.div
                className={styles.account}
                initial={animationInitials.content}
                animate={contentControls}
            >
                <Text
                    type='body'
                    align='center'
                    weight='regular'
                >
                    {t('Top-up')}
                </Text>
                <Text
                    type='body'
                    align='center'
                    weight='medium'
                >
                    {t('Card')} {formatCardLastFourDigits(cardNumber)}
                </Text>
            </motion.div>

            <div className={styles.currency}>
                <motion.div
                    className={styles.currencyIcon}
                    initial={animationInitials.currency}
                    animate={currencyIconControls}
                    style={currencyId === CURRENCY.RUB.id ? SBP_IMAGE_STYLES : undefined}
                >
                    <img
                        src={currencyImage}
                        alt=''
                    />
                </motion.div>
                <div className={styles.blurContainer}>
                    <motion.div
                        className={styles.successBlur}
                        initial={animationInitials.blur}
                        animate={blurControls}
                        style={{ backgroundImage: `url(${successBlur})` }}
                    />
                </div>
            </div>

            {!!receivedAmount && <Text
                type='headline'
                align='center'
                weight='semibold'
                className={styles.amount}
            >
                <FormattedAmount
                    value={toMinorUnits(receivedAmount, currencyMinority)}
                    currency={currencyCode}
                    minority={currencyMinority}
                    positiveSymbol='plus'
                />
            </Text>}

            <motion.div
                className={styles.fee}
                initial={animationInitials.content}
                animate={contentControls}
            >
                {!!receivedAmountFee && <Text
                    type='body'
                    align='center'
                    weight='regular'
                    className={styles.feeAmount}
                >
                    {t('Transaction fee')} {formatAmount({
                        value: receivedAmountFee,
                        currency: currencyCode,
                        minority: 0,
                        locale
                    }).formattedWithCurrency}
                </Text>}
            </motion.div>
        </CenteredContent>
    );
}