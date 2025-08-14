import { Input } from '@/uikit';
import { useTranslation } from 'react-i18next';
import styles from './BonusLink.module.scss';

type BonusLinkProps = {
    shareUrl: string
}

export function BonusLink({ shareUrl }: BonusLinkProps) {
    const [t] = useTranslation();
    return (
        <div className={styles.root}>
            <Input
                type='text'
                value={shareUrl}
                canCopy
                readOnly
                copiedToastText={t('Link copied')}
                className={styles.input}
            />
        </div>
    );
}