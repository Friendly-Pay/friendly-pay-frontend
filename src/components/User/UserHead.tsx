import { SupportMessage } from '../Icons/Support';
import { Avatar } from './Avatar';
import { useUserStore } from '@/states/user/store';
import { openTelegramLink } from '@/utils';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import styles from './UserHead.module.scss';

type UserHeadProps = {
    className?: string
}

export function UserHead({ className, children }: PropsWithChildren<UserHeadProps>) {
    const avatar = useUserStore(state => state.user!.avatar);
    const handleSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    return (
        <div
            id='pageHead'
            className={classNames(styles.root, className)}
        >
            <div className={styles.wrap}>
                {avatar && <Avatar
                    src={avatar}
                    className={styles.avatar}
                />}

                {children && <div className={styles.content}>
                    {children}
                </div>}

                <button
                    className={styles.support}
                    onClick={handleSupport}
                >
                    <SupportMessage />
                </button>
            </div>
        </div>
    );
}