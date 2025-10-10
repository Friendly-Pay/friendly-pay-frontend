import euro from 'assets/iban/eur.png?inline';
import classNames from 'classnames';
import styles from './IbanHead.module.scss';

type IbanHeadProps = {
    className?: string
}

export function IbanHead({ className }: IbanHeadProps) {
    return (
        <div className={classNames(styles.head, className)}>
            <div className={styles.euro}>
                <img
                    src={euro}
                    alt=''
                    className={styles.eurImage}
                />
            </div>
        </div>
    );
}