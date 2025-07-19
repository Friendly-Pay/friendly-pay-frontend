import { isSanctionEmail } from '../utils/sanctionEmail';
import { StageRoot } from './Common/StageRoot';
import { TelegramMainButton } from '@/components/common/TelegramMainButton';
import { useVerificationStore, VerificationStage } from '@/states/verification/store';
import { Input, Text } from '@/uikit';
import { blurFocusedInput } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './EmailStage.module.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export function EmailStage() {
    const [t] = useTranslation();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | undefined>();
    const emailErrorTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (emailErrorTimeoutRef.current) {
                clearTimeout(emailErrorTimeoutRef.current);
            }
        };
    }, []);

    const handleEnterKeyDown = (evt: any) => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            handleSubmit();
        }
    };

    const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;
        if (newValue.length > 100) return;

        setEmail(newValue);
        setEmailError(undefined);
        if (emailErrorTimeoutRef.current) {
            clearTimeout(emailErrorTimeoutRef.current);
        }
        emailErrorTimeoutRef.current = setTimeout(() => {
            if (!newValue.length) {
                setEmailError(t('Enter your email'));
            } else if (!EMAIL_REGEX.test(newValue)) {
                setEmailError(t('Invalid email format'));
            } else if (isSanctionEmail(newValue)) {
                setEmailError(t('This email is not supported'));
            } else {
                setEmailError(undefined);
            }
        }, 1_000);
    };

    const isSubmitDisabled =
        !email.length ||
        !!emailError ||
        !EMAIL_REGEX.test(email);

    const setStage = useVerificationStore(state => state.setStage);
    const setUserDataProperty = useVerificationStore(state => state.setUserDataProperty);
    const handleSubmit = useCallback(() => {
        if (isSubmitDisabled) return;
        blurFocusedInput();
        setUserDataProperty('email', email);
        setStage(VerificationStage.PhoneNumber);
    }, [isSubmitDisabled, email, setStage, setUserDataProperty]);

    return (
        <StageRoot className={styles.root}>
            <div className={styles.content}>
                <Text
                    type='headline'
                    align='left'
                    weight='semibold'
                    className={styles.title}
                >
                    {t('Please provide your email, we will send the codes 💌')}
                </Text>

                <div className={styles.field}>
                    <Input
                        ref={inputRef}
                        type='email'
                        name='email'
                        value={email}
                        autoFocus={true}
                        onChange={handleEmailChange}
                        onKeyDown={handleEnterKeyDown}
                        placeholder={t('Email')}
                        autoComplete='off'
                        tabIndex={1}
                        enterKeyHint={'next'}
                    />
                    {emailError && (
                        <Text
                            type="captionSmall"
                            align="left"
                            className={classNames(styles.caption, styles.error)}
                        >
                            {emailError}
                        </Text>
                    )}
                </div>
            </div>

            <TelegramMainButton
                text={t('Continue')}
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
            />
        </StageRoot>
    );
}