import { languageCodeToLocale } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatCurrency } from '@/utils';
import { useTranslation } from 'react-i18next';
// import { formatDateWithLabel } from '@/utils/date';
// import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './TransactionItem.module.scss';

type TransactionItemProps = {
    type: 'deposit' | 'payment';
    status: 'success' | 'fail' | 'in-progress';
    createdAt: number; // timestamp unix
    amount: number;
    currency: string;
    onClick?: () => void
}

const formatDateWithTime = (dateInput: Date | string, locale: string, t: any) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const formattedDate = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);

    return `${formattedDate} ${t('at')} ${formattedTime}`;
};

export function TransactionItem({ type, amount, currency, createdAt, onClick }: TransactionItemProps) {
    const [t] = useTranslation();
    const languageCode = useUserStore(state => state.languageCode);
    const languageLocale = languageCodeToLocale(languageCode);

    return (
        <div
            className={classNames(styles.root, styles[type])}
            onClick={onClick}
        >
            <div className={styles.icon}>
                {type === 'deposit' ? <Deposit /> : <Payment />}
            </div>

            <div className={styles.content}>
                <div className={styles.type}>
                    <Text
                        type='body'
                        align='left'
                        weight='medium'
                        className={styles.title}
                    >{type === 'deposit' ? t('Deposit') : t('Payment')}</Text>
                    <Text
                        type='caption'
                        align='left'
                        weight='regular'
                        className={styles.date}
                    >
                        {formatDateWithTime(new Date(Number(createdAt) * 1_000), languageLocale, t)}
                        {/* {formatDateWithLabel(new Date(Number(createdAt) * 1_000))} */}
                    </Text>
                </div>

                <Text
                    type='body'
                    align='right'
                    weight='semibold'
                    className={styles.amount}
                >
                    {type === 'deposit' && '+'}{formatCurrency(amount, currency, languageCodeToLocale(languageCode), 2)}
                </Text>
            </div>
        </div>
    );
}

const Deposit = () => {
    return (
        <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.4961 8.39941C11.4961 8.62728 11.4072 8.83008 11.2295 9.00781L6.75195 13.499C6.66992 13.5856 6.57194 13.6517 6.45801 13.6973C6.34863 13.7428 6.2347 13.7656 6.11621 13.7656C6.00228 13.7656 5.89062 13.7428 5.78125 13.6973C5.67188 13.6517 5.57389 13.5856 5.4873 13.499L1.00977 9.00781C0.832031 8.83008 0.743164 8.62728 0.743164 8.39941C0.743164 8.15788 0.820638 7.95964 0.975586 7.80469C1.13053 7.64974 1.32422 7.57227 1.55664 7.57227C1.67969 7.57227 1.79134 7.59733 1.8916 7.64746C1.99186 7.69303 2.08073 7.75456 2.1582 7.83203L3.70312 9.36328L5.86328 11.7969L5.36426 12.084L5.26855 9.71191V1.60449C5.26855 1.34928 5.34603 1.13965 5.50098 0.975586C5.66048 0.811523 5.86556 0.729492 6.11621 0.729492C6.37142 0.729492 6.5765 0.811523 6.73145 0.975586C6.89095 1.13965 6.9707 1.34928 6.9707 1.60449V9.71191L6.875 12.084L6.37598 11.7969L8.53613 9.36328L10.0742 7.83203C10.1517 7.75456 10.2406 7.69303 10.3408 7.64746C10.4456 7.59733 10.5596 7.57227 10.6826 7.57227C10.915 7.57227 11.1087 7.64974 11.2637 7.80469C11.4186 7.95964 11.4961 8.15788 11.4961 8.39941ZM11.4961 14.5928C11.4961 14.8252 11.4186 15.0212 11.2637 15.1807C11.1087 15.3402 10.915 15.4199 10.6826 15.4199H1.56348C1.33105 15.4199 1.13509 15.3402 0.975586 15.1807C0.820638 15.0212 0.743164 14.8252 0.743164 14.5928C0.743164 14.3558 0.820638 14.1576 0.975586 13.998C1.13509 13.8431 1.33105 13.7656 1.56348 13.7656H10.6826C10.915 13.7656 11.1087 13.8431 11.2637 13.998C11.4186 14.1576 11.4961 14.3558 11.4961 14.5928Z"
                fill="white"
            />
        </svg>
    );
};

const Payment = () => {
    return (
        <svg
            width="15"
            height="13"
            viewBox="0 0 15 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13.9656 6.69727C13.9656 6.92628 13.8829 7.12136 13.7175 7.2825L9.53813 11.4492C9.37273 11.6146 9.18826 11.6973 8.9847 11.6973C8.75145 11.6973 8.56273 11.6252 8.41854 11.481C8.27435 11.3368 8.20226 11.1587 8.20226 10.9466C8.20226 10.8279 8.22346 10.7219 8.26587 10.6285C8.31252 10.5353 8.37189 10.4526 8.44398 10.3805L9.86889 8.94281L12.1272 6.88175L12.4198 7.35884L10.1043 7.49243H2.59793C2.3562 7.49243 2.16111 7.42034 2.01268 7.27615C1.86425 7.12771 1.79004 6.93475 1.79004 6.69727C1.79004 6.46402 1.86425 6.2753 2.01268 6.13111C2.16111 5.98268 2.3562 5.90846 2.59793 5.90846H10.1043L12.4198 6.03569L12.1272 6.52551L9.86889 4.45172L8.44398 3.01406C8.37189 2.94197 8.31252 2.85927 8.26587 2.76597C8.22346 2.66842 8.20226 2.5624 8.20226 2.4479C8.20226 2.23586 8.27435 2.05774 8.41854 1.91355C8.56273 1.76936 8.75145 1.69727 8.9847 1.69727C9.08224 1.69727 9.17766 1.71847 9.27096 1.76088C9.36849 1.79905 9.46179 1.86266 9.55085 1.95172L13.7175 6.11203C13.8829 6.27317 13.9656 6.46826 13.9656 6.69727Z"
                fill="white"
            />
        </svg>
    );
};