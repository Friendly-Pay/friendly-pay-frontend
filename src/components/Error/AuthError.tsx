import { useAuthStore } from '@/states/auth/store';
import { Text } from '@/uikit';
import { Button } from '@/uikit/Button';
import { openTelegramLink } from '@/utils';
import styles from './AuthError.module.scss';

export function AuthError() {
    const authData = useAuthStore(state => state.authData);
    const handleClick = () => {
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    return (
        <div className={styles.root}>
            <div className={styles.top}>
                <Text
                    type='headlineLarge'
                    align='center'
                    className={styles.title}
                >
                    Auth error
                </Text>

                <Text
                    type='captionSmall'
                    align='center'
                    className={styles.text}
                >
                    {authData}
                </Text>
            </div>

            <Button
                view='secondary'
                className={styles.button}
                onClick={handleClick}
            >
                Support
            </Button>
        </div>
    );
}