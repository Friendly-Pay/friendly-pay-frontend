import { MainLayout } from '@/components/common/MainLayout';
import { TelegramButtons } from '@/components/Telegram';
import { Routes } from '@/routes';
import { useAuthStore } from '@/states/auth/store';
import { useLoginStore } from '@/states/login/store';
import { Input, Text } from '@/uikit';
import { openWebviewLink } from '@/utils';
import { FetchStatus } from '@/utils/api';
import { isSanctionEmail } from '@/utils/email';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './AuthLoginView.module.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export function AuthLoginView() {
    const [t] = useTranslation();
    const isAuth = useAuthStore(state => state.isAuth);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [emailError, setEmailError] = useState<string | undefined>();

    const email = useLoginStore(state => state.typedEmail);
    const serverError = useLoginStore(state => state.confirmationServerError);
    const fetchStatus = useLoginStore(state => state.confirmationCodeFetchStatus);
    const setEmail = useLoginStore(state => state.setTypedEmail);

    const navigate = useNavigate();

    useEffect(() => {
        if (emailError || serverError) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid');
        }
    }, [emailError, serverError]);

    const handleSubmit = useCallback(async () => {
        const { sendConfirmationCode, setConfirmationState } = useLoginStore.getState();
        setConfirmationState('INITIAL');

        try {
            await sendConfirmationCode(email);
            navigate(Routes.EMAIL_CONFIRMATION);
        } catch { }
    }, [email, navigate]);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setEmailError(undefined);
        setEmail(newValue);

        if (isSanctionEmail(newValue)) {
            setEmailError(t('This email is not supported'));
        }

        if (serverError) {
            useLoginStore.getState().resetConfirmationCodeServerError();
        }
    };

    const isSubmitButtonDisabled = useCallback(() => {
        if (email) {
            const EMAIL_VALID = EMAIL_REGEX.test(email);
            return !EMAIL_VALID || !!emailError || !!serverError;
        }

        return true;
    }, [email, emailError, serverError]);

    const handleEnterKeyDown = (evt: any) => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            handleSubmit();
        }
    };

    const handleOpenLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const url = e.currentTarget.href;
        openWebviewLink(url, { try_instant_view: true });
    };

    if (isAuth) {
        return (
            <Navigate
                to={Routes.HOME}
                replace
            />
        );
    }

    return (
        <MainLayout>
            <Text
                type='headline'
                align='left'
                weight='semibold'
                className={styles.title}
            >
                {t('Hi! Please tell us your email and log in 👌')}
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
                {Boolean(emailError || serverError) && (
                    <Text
                        type='caption'
                        align='left'
                        role='alert'
                        className={styles.error}

                    >
                        {emailError || serverError}
                    </Text>
                )}
            </div>

            <Text
                type='caption'
                align='left'
                weight='regular'
                className={styles.agreement}
            >
                {t('By clicking “Continue”, I agree to the')} <a
                    href={import.meta.env.VITE_LEGAL_USER_AGREEMENT}
                    className={styles.link}
                    onClick={handleOpenLink}
                >{t('terms')}</a>, {t('and give my consent to the processing of my personal data')}
            </Text>

            <TelegramButtons.MainButton
                text={t('Continue')}
                loading={fetchStatus === FetchStatus.Pending}
                disabled={isSubmitButtonDisabled()}
                onClick={handleSubmit}
            />
        </MainLayout>
    );
}