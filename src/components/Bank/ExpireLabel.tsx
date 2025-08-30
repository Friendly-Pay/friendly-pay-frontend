import { safeLanguageCode } from '@/localization/utils';
import { useUserStore } from '@/states/user/store';
import classNames from 'classnames';
import styles from './ExpireLabel.module.scss';

type ExpireLabelProps = {
    unix: number
    className?: string
}

const Clock = () => {
    return (
        <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.69499 8.335L6.67499 6.5H5.31999L3.29999 8.335C2.73499 8.845 2.54999 9.63 2.82499 10.34C3.09999 11.045 3.76999 11.5 4.52499 11.5H7.46999C8.22999 11.5 8.89499 11.045 9.16999 10.34C9.44499 9.63 9.25999 8.845 8.69499 8.335ZM6.90999 9.57H5.08999C4.89999 9.57 4.74999 9.415 4.74999 9.23C4.74999 9.045 4.90499 8.89 5.08999 8.89H6.90999C7.09999 8.89 7.24999 9.045 7.24999 9.23C7.24999 9.415 7.09499 9.57 6.90999 9.57Z"
                fill="currentColor"
            />
            <path
                d="M9.17499 2.66C8.89999 1.955 8.22999 1.5 7.47499 1.5H4.52499C3.76999 1.5 3.09999 1.955 2.82499 2.66C2.55499 3.37 2.73999 4.155 3.30499 4.665L5.32499 6.5H6.67999L8.69999 4.665C9.25999 4.155 9.44499 3.37 9.17499 2.66ZM6.90999 4.115H5.08999C4.89999 4.115 4.74999 3.96 4.74999 3.775C4.74999 3.59 4.90499 3.435 5.08999 3.435H6.90999C7.09999 3.435 7.24999 3.59 7.24999 3.775C7.24999 3.96 7.09499 4.115 6.90999 4.115Z"
                fill="currentColor"
            />
        </svg>
    );
};

const normalizeEpoch = (ts: number): number => (ts < 1e12 ? ts * 1000 : ts); // сек → мс

const pluralRu = (n: number, forms: [string, string, string]) => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
    return forms[2];
};

const formatTimeLeft = (customExpireAt: number, locale: string): string => {
    const target = normalizeEpoch(customExpireAt);
    const now = Date.now();
    const diffMs = Math.max(0, target - now);
    const totalSec = Math.floor(diffMs / 1000);

    if (diffMs <= 0) {
        return locale === 'ru' ? 'Истекла' : 'Expired';
    }

    const days = Math.floor(totalSec / 86400);
    if (days >= 1) {
        if (locale === 'ru') return `${days} ${pluralRu(days, ['день', 'дня', 'дней'])}`;
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }

    const hours = Math.floor(totalSec / 3600);
    if (hours >= 1) {
        if (locale === 'ru') return `${hours} ${pluralRu(hours, ['час', 'часа', 'часов'])}`;
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (locale === 'ru') return `${minutes} мин ${seconds} сек`;
    return `${minutes} min ${seconds} sec`;
};

export function ExpireLabel({ unix, className }: ExpireLabelProps) {
    const languageCode = useUserStore(state => state.languageCode);
    const locale = safeLanguageCode(languageCode);

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.icon}>
                <Clock />
            </div>
            <div className={styles.text}>
                {formatTimeLeft(unix, locale)}
            </div>
        </div>
    );
}