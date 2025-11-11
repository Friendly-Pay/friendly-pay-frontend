import { AddFriend } from '../Icons/Friend';
import { SupportMessage } from '../Icons/Support';
// import { SupportMessage } from '../Icons/Support';
import { Avatar } from './Avatar';
import { useUserStore } from '@/states/user/store';
import { openTelegramLink } from '@/utils';
// import { openTelegramLink } from '@/utils';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './UserHead.module.scss';

type UserHeadProps = {
    className?: string
}

export function UserHead({ className, children }: PropsWithChildren<UserHeadProps>) {
    const avatar = useUserStore(state => state.user!.avatar);

    const handleOpenSupport = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    const navigate = useNavigate();
    const handleOpenProfile = () => {
        navigate('/user/profile');
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
                    onClick={handleOpenProfile}
                />}

                {children && <div className={styles.content}>
                    {children}
                </div>}

                <div className={styles.buttons}>
                    {/* {hasAccessToFriendsBonus && <button
                        className={styles.friends}
                        onClick={handleOpenFriends}
                    >
                        <AddFriend />
                    </button>} */}
                    <button
                        className={styles.support}
                        onClick={handleOpenSupport}
                    >
                        <SupportMessage />
                    </button>
                </div>
            </div>
        </div>
    );
}