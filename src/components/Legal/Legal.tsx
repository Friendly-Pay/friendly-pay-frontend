import { openWebviewLink } from '@/utils';
import classNames from 'classnames';
import styles from './Legal.module.scss';

type LegalProps = {
    className?: string
}

export function Legal({ className }: LegalProps) {
    const handleOpenLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const url = e.currentTarget.href;
        openWebviewLink(url, { try_instant_view: true });
    };

    return (
        <div className={classNames(styles.root, className)}>
            © 2025 Friendly IT Solutions Limited (Company Number 78763622). Services are provided by Friendly IT Solutions Limited. By continuing to use this application you agree to be bound by our <a
                rel="noopener"
                href='https://cdn.friendlypay.me/legal/privacy_policy.pdf'
                onClick={handleOpenLink}
            >User Agreement</a> and <a
                rel="noopener"
                href='https://cdn.friendlypay.me/legal/privacy_policy.pdf'
                onClick={handleOpenLink}
            >Privacy Policy</a>.
        </div>
    );
}