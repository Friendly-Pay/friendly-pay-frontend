import { SettingsList } from './components/SettingsList';
import { MainLayout } from '@/components/common/MainLayout';
import { Phone } from '@/components/Icons/Phone';
import { Plane } from '@/components/Icons/Plane';
import { Avatar } from '@/components/User/Avatar';
import { useUserStore, VerificationStatus } from '@/states/user/store';
import { Text } from '@/uikit';
import { formatPhoneNumber, formatUserFirstNameAndLastName, formatUsername, openWebviewLink } from '@/utils';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './ProfileView.module.scss';

const LEGAL_USER_AGREEMENT = import.meta.env.VITE_LEGAL_USER_AGREEMENT;
const LEGAL_TERMS_AND_CONDITIONS = import.meta.env.VITE_LEGAL_TERMS_AND_CONDITIONS;
const LEGAL_PRIVACY_POLICY = import.meta.env.VITE_LEGAL_PRIVACY_POLICY;
const LEGAL_KYC_AML = import.meta.env.VITE_LEGAL_KYC_AML;

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

                <div className={classNames(styles.data, styles.personalData)}>
                    <div className={styles.iconItem}>
                        <div className={styles.icon}><Plane /></div>
                        <Text
                            type='body'
                            weight='regular'
                            align='left'
                            className={styles.value}
                        >{user.email}</Text>
                    </div>

                    <div className={styles.iconItem}>
                        <div className={styles.icon}><Phone /></div>
                        <Text
                            type='body'
                            weight='regular'
                            align='left'
                            className={styles.value}
                        >{formatPhoneNumber(user.phoneNumber)}</Text>
                    </div>
                </div>

                <div className={styles.data}>
                    <div className={styles.dataItem}>
                        <Text
                            type='bodyLarge'
                            weight='semibold'
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
                        type='bodyLarge'
                        weight='semibold'
                        align='left'
                        className={styles.title}
                    >{t('Settings')}</Text>

                    <SettingsList />
                </div>

                <div className={styles.legal}>
                    <Text
                        type='bodyLarge'
                        weight='semibold'
                        align='left'
                        className={styles.title}
                    >{t('Information')}</Text>

                    <div className={styles.legalList}>
                        {!!LEGAL_USER_AGREEMENT && <a
                            href={LEGAL_USER_AGREEMENT}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('User Agreement')}</a>}

                        {!!LEGAL_PRIVACY_POLICY && <a
                            href={LEGAL_PRIVACY_POLICY}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('Privacy Policy')}</a>}

                        {!!LEGAL_TERMS_AND_CONDITIONS && <a
                            href={LEGAL_TERMS_AND_CONDITIONS}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('Terms of use')}</a>}

                        {!!LEGAL_KYC_AML && <a
                            href={LEGAL_KYC_AML}
                            className={styles.link}
                            onClick={handleOpenLink}
                        >{t('KYC and AML')}</a>}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}