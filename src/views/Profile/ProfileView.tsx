import { MainLayout } from '@/components/common/MainLayout';
import { Avatar } from '@/components/User/Avatar';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import styles from './ProfileView.module.scss';

type ProfileViewProps = {
}

export function ProfileView({ }: ProfileViewProps) {
    const user = useUserStore(state => state.user!);
    const name = user.firstName || user.lastName || user.username;
    return (
        <MainLayout>
            <div className={styles.head}>
                {user.avatar && <Avatar src={user.avatar} />}
                <Text
                    type='headline'
                    align='center'
                    weight='semibold'
                    className={styles.name}
                >{name}</Text>
            </div>

            <div className={styles.data}>
                <div className={styles.item}>
                    <Text
                        type='bodyLarge'
                        weight='medium'
                        align='left'
                        className={styles.value}
                    >alex@gmail.com</Text>
                    <Text
                        type='caption'
                        align='left'
                        className={styles.text}
                    >Email</Text>
                </div>

                <div className={styles.item}>
                    <Text
                        type='bodyLarge'
                        weight='medium'
                        align='left'
                        className={styles.value}
                    >+7 920 800 00 08</Text>
                    <Text
                        type='caption'
                        align='left'
                        className={styles.text}
                    >Номер телефона</Text>
                </div>

                <a className={styles.item}>
                    <Text
                        type='bodyLarge'
                        weight='medium'
                        align='left'
                        className={styles.value}
                    >Basic</Text>
                    <Text
                        type='caption'
                        align='left'
                        className={styles.text}
                    >Уровень верификации</Text>
                </a>
            </div>
        </MainLayout>
    );
}