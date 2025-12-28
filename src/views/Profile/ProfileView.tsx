import { SettingsList } from './components/SettingsList';
import { MainLayout } from '@/components/common/MainLayout';
import { Avatar } from '@/components/User/Avatar';
import { useUserStore, VerificationStatus } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatPhoneNumber, formatUserFirstNameAndLastName, formatUsername, openWebviewLink } from '@/utils';
import { useTranslation } from 'react-i18next';
import styles from './ProfileView.module.scss';

export function ProfileView() {
    const [t] = useTranslation();
    const user = useUserStore(state => state.user!);
    const hasCompletedKyc = Boolean(user.verificationStatus === VerificationStatus.Success);

    let name: string | null;
    if (hasCompletedKyc) {
        name = formatUserFirstNameAndLastName(user.firstName!, user.lastName!);
    } else if (user.username) {
        name = formatUsername(user.username);
    } else {
        name = user.firstName || user.lastName;
    }

    const handleOpenLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const url = e.currentTarget.href;
        openWebviewLink(url, { try_instant_view: true });
    };

    return (
        <MainLayout className={styles.layout}>
            <div className={styles.content}>
                <div className={styles.head}>
                    {user.avatar && <Avatar
                        src={user.avatar}
                        className={styles.avatar}
                    />}
                    <Text
                        type='headline'
                        align='center'
                        weight='semibold'
                        className={styles.name}
                    >{name}</Text>
                </div>

                <div className={styles.data}>
                    {user.email && <div className={styles.dataItem}>
                        <Text
                            type='body'
                            align='left'
                            className={styles.value}
                        >{user.email}</Text>
                        <Text
                            type='caption'
                            align='left'
                            className={styles.text}
                        >{t('Email')}</Text>
                    </div>}

                    {user.phoneNumber && <div className={styles.dataItem}>
                        <Text
                            type='body'
                            align='left'
                            className={styles.value}
                        >{formatPhoneNumber(user.phoneNumber)}</Text>
                        <Text
                            type='caption'
                            align='left'
                            className={styles.text}
                        >{t('Phone number')}</Text>
                    </div>}

                    <div className={styles.dataItem}>
                        <Text
                            type='body'
                            align='left'
                            className={styles.value}
                        >{hasCompletedKyc ? 'Basic' : t('Not completed')}</Text>
                        <Text
                            type='caption'
                            align='left'
                            className={styles.text}
                        >{t('Verification level')}</Text>
                    </div>
                </div>

                <div className={styles.settings}>
                    <Text
                        weight='semibold'
                        align='left'
                        className={styles.title}
                    >{t('Settings')}</Text>

                    <SettingsList />
                </div>

                <div className={styles.legal}>
                    <Text
                        weight='semibold'
                        align='left'
                        className={styles.title}
                    >{t('Information')}</Text>

                    <div className={styles.legalList}>
                        <a
                            href={import.meta.env.VITE_LEGAL_USER_AGREEMENT}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('User Agreement')}</a>

                        <a
                            href={import.meta.env.VITE_LEGAL_PRIVACY_POLICY}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('Privacy Policy')}</a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}