import { Cloud } from '../Icons/Cloud';
import { Eye } from '../Icons/Eye';
// import { FriendlyPaySign } from '../Icons/FriendlyPay';
import { CardDesign } from './CardDesign';
import { PaymentSystemIcon } from './PaymentSystemIcon';
import { CardStatus, PaymentSystem } from '@/states/cards/store';
import { Spinner } from '@/uikit';
import { formatCardLastFourDigits } from '@/utils';
import { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './BankCard.module.scss';

type BankCardProps = {
    typeId: number
    lastFourDigits?: string | null
    hideDigits?: boolean
    paymentSystem: PaymentSystem
    status?: CardStatus
    active?: boolean
    virtual?: boolean;
    style?: CSSProperties
    className?: string
    onClick?: () => void
    onClickDigits?: () => void
}

export function BankCard({ typeId, lastFourDigits, hideDigits, paymentSystem, status, active, virtual, style, className, onClick, onClickDigits }: BankCardProps) {
    const lastFourDigitsPlaceholder = '••••';

    const handleClickDigits = (event: any) => {
        event.preventDefault();
        onClickDigits?.();
    };

    return (
        <CardDesign
            typeId={typeId}
            style={{ width: '251px', height: '165px', ...style }}
            className={classNames(styles.card, active && styles.active, className)}
            backgroundClassName={styles.background}
            onClick={onClick}
        >
            <div className={styles.top}>
                {/* <FriendlyPaySign /> */}

                {virtual && <div className={styles.cloud}><Cloud /></div>}
            </div>

            <div className={classNames(styles.bottom, !hideDigits && styles.withDigits)}>
                {!hideDigits && <div
                    className={styles.lastFourDigits}
                    onClick={handleClickDigits}
                >
                    <div>{formatCardLastFourDigits(lastFourDigits || lastFourDigitsPlaceholder)}</div>
                    {lastFourDigits && <div className={styles.eye}><Eye /></div>}
                </div>}

                <div className={styles.paymentSystem}>
                    <PaymentSystemIcon paymentSystem={paymentSystem} />
                </div>
            </div>

            {status === CardStatus.Activation && <div className={styles.activationBackground}>
                <Spinner />
            </div>}
        </CardDesign>
    );
}