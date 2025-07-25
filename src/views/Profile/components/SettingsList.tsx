import { LanguageModal } from './LanguageModal';
import { ArrowRight } from '@/components/Icons/Arrow';
import { languages, savePreferredLanguage } from '@/localization';
import { useUserStore } from '@/states/user/store';
import { Text } from '@/uikit';
import { Switch } from '@/uikit/Switch';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './SettingsList.module.scss';

type SettingsListProps = {
    className?: string
}

export function SettingsList({ className }: SettingsListProps) {
    const [t, i18n] = useTranslation();
    const localeForUpdate = useRef<string | null>();
    const currentLanguage = languages.find(l => l.locale === i18n.language) ?? languages[0];
    const [languageModalOpened, setLanguageModalOpened] = useState(false);
    const languageModalOpenedRef = useRef<boolean>(false);

    const handleLanguageOpen = () => {
        setLanguageModalOpened(true);
        languageModalOpenedRef.current = true;
    };
    const handleLanguageModalClose = () => {
        setLanguageModalOpened(false);
        languageModalOpenedRef.current = false;
    };
    const handleLanguageChange = (locale: string) => {
        localeForUpdate.current = locale;
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        handleLanguageModalClose();
    };
    const handleLanguageModalAnimationComplete = () => {
        if (languageModalOpenedRef.current) return;
        if (localeForUpdate.current) {
            const language = localeForUpdate.current;
            localeForUpdate.current = null;
            useUserStore.getState().setLanguageCode(language);
            savePreferredLanguage(language);
        }
    };

    const blurBalance = useUserStore(state => state.blurBalance);
    const toggleBlurBalance = (blur: boolean) => {
        const { setBlurBalance } = useUserStore.getState();
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        setBlurBalance(blur);
    };

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.item}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Language')}
                </Text>

                <div
                    className={styles.value}
                    onClick={handleLanguageOpen}
                >
                    <div
                        key={currentLanguage.locale}
                        className={styles.language}
                    >
                        <div className={styles.languageEmoji}>{currentLanguage.emoji}</div>
                        <div className={styles.languageName}>{currentLanguage.name}</div>
                    </div>
                    <div className={styles.arrow}><ArrowRight /></div>
                </div>
            </div>

            <LanguageModal
                isOpen={languageModalOpened}
                onChange={handleLanguageChange}
                onClose={handleLanguageModalClose}
                onAnimationCompleted={handleLanguageModalAnimationComplete}
            />

            <div className={styles.item}>
                <Text
                    type='body'
                    align='left'
                    weight='regular'
                    className={styles.text}
                >
                    {t('Hide balances')}
                </Text>

                <div className={styles.value}>
                    <Switch
                        checked={blurBalance}
                        onChange={toggleBlurBalance}
                    />
                </div>
            </div>
        </div >
    );
}