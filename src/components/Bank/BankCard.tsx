import { Eye } from '../Icons/Eye';
import { RepkaLogo } from '../Icons/Repka';
import { CardDesign } from './CardDesign';
import { PaymentSystemIcon } from './PaymentSystemIcon';
import { PaymentSystem, useCardsStore } from '@/states/cards/store';
import { Spinner } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import styles from './BankCard.module.scss';

type BankCardProps = {
    cardTypeId: number

    /** Последние 4 цифры карты */
    lastFourDigits?: string | null
    hideLastFourDigits?: boolean

    /** Платежная система VISA / MIR / MASTERCARD */
    paymentSystem: PaymentSystem

    /** Стейт обработки */
    isPending?: boolean;

    /** Стейт недоступна */
    isDisabled?: boolean;

    className?: string

    onClick?: () => void
}

const spinnerAppearance = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
};

const logoAppearance = {
    initial: {
        opacity: 0,
        scale: 0.86
    },
    animate: {
        opacity: 1,
        scale: 1,
    },
    exit: {
        opacity: 0
    },
    transition: {
        duration: 0.2
    }
};

const lastFourDigitsPlaceholder = '••••';

const componentStyles = {
    width: '251px',
    height: '165px',
};

export function BankCard({ cardTypeId, lastFourDigits, hideLastFourDigits, paymentSystem, isPending, isDisabled, className, onClick }: BankCardProps) {
    const openCardDetails = useCardsStore(state => state.openCardDetails);

    const handleOpenCardDetails = () => {
        if (!lastFourDigits || hideLastFourDigits) {
            return;
        }
        openCardDetails();
    };

    return (
        <CardDesign
            cardTypeId={cardTypeId}
            className={classNames(styles.card, isPending && styles.pending, className)}
            backgroundClassName={styles.background}
            style={componentStyles}
            onClick={onClick}
        >
            <div className={styles.top}>
                <AnimatePresence
                    mode='wait'
                    initial={false}
                >
                    {isPending ? (
                        <motion.div
                            key='spinner'
                            {...spinnerAppearance}
                            className={styles.spinnerWrap}
                        >
                            <Spinner className={styles.spinner} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='logo'
                            {...logoAppearance}
                            className={styles.logo}
                        >
                            <RepkaLogo />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={classNames(styles.bottom, !hideLastFourDigits && styles.withDigits)}>

                <div
                    className={styles.lastFourDigits}
                    onClick={handleOpenCardDetails}
                >
                    {!hideLastFourDigits && (
                        <>
                            <div>{formatCardLastFourDigits(lastFourDigits || lastFourDigitsPlaceholder)}</div>
                            {lastFourDigits && (
                                <div className={styles.eye}><Eye /></div>
                            )}
                        </>
                    )}
                </div>


                <div className={styles.paymentSystem}>
                    <PaymentSystemIcon paymentSystem={paymentSystem} />
                </div>
            </div>

            {isDisabled && (
                <div className={styles.overlay} />
            )}
        </CardDesign >
    );
}