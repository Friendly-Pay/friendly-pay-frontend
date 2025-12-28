import { Confirmation } from './components/Confirmation';
import { ConfirmationTexts } from './components/types';
import { maskEmail } from './maskEmail';
import { MainLayout } from '@/components/common/MainLayout';
import { Routes } from '@/routes';
import { EMAIL_CONFIRMATION_CODE_LENGTH, useLoginStore } from '@/states/login/store';
import { Text } from '@/uikit';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './EmailCodeView.module.scss';

export function EmailCodeView() {
    const [t] = useTranslation();
    const email = useLoginStore(state => state.typedEmail);
    const redirectUrl = useLoginStore(state => state.redirectUrl);
    const confirmationState = useLoginStore(state => state.confirmationState);
    const loginServerError = useLoginStore(state => state.loginServerError);
    const setConfirmationState = useLoginStore(state => state.setConfirmationState);

    // @TODO
    const texts: ConfirmationTexts = useMemo(() => ({
        title: t('Enter the code from the email'),
        codeError: t('The code is incorrect, please check it'),
        codeErrorExpired: t('The code has expired, please request a new one'),
        codeSended: t('A new code has been sent'),
        buttonRetry: t('Request code again'),
        linkToSupport: t('Didn’t receive the code?'),
        countdown: t('You can request a new one in')
    }), [t]);

    const formattedMaskedEmail = email
        ? maskEmail(email)
        : undefined;

    useEffect(() => {
        if (loginServerError) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            switch (loginServerError) {
                case 'Expired':
                    setConfirmationState('CODE_EXPIRED');
                    break;
                case 'NotValid':
                    setConfirmationState('CODE_ERROR');
                    break;
            }
        }
    }, [loginServerError]);

    const navigate = useNavigate();
    useEffect(() => {
        if (redirectUrl) {
            navigate(redirectUrl, { replace: true });
        }
    }, [redirectUrl]);

    const handleInputFinished = async (value: string) => {
        if (value.length === EMAIL_CONFIRMATION_CODE_LENGTH) {
            const { confirmEmail, resetLoginServerError } = useLoginStore.getState();
            if (loginServerError) {
                resetLoginServerError();
            }

            try {
                await confirmEmail(value);
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            } catch (error) {
                console.error('Ошибка при подтверждении email', error);
                setConfirmationState('CODE_ERROR');
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        } else {
            setConfirmationState('CODE_ERROR');
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
    };

    const timeout = useRef<any>();

    const handleEmailCodeRepeat = async () => {
        const { typedEmail, sendConfirmationCode, resetLoginServerError } = useLoginStore.getState();
        if (!typedEmail) return;
        if (loginServerError) {
            resetLoginServerError();
        }

        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        sendConfirmationCode(typedEmail)
            .catch(error => {
                console.error(error);
                toast.error(t('Failed to send a new code'));
            });


        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        // Чтобы компонента блокировала повторную отправку кода после его нажатия
        timeout.current = setTimeout(() => {
            setConfirmationState('INITIAL');
        }, 1000);
    };

    useEffect(() => {
        return () => {
            clearInterval(timeout.current);
        };
    }, []);

    if (!email) {
        return (
            <Navigate
                to={Routes.AUTH_LOGIN}
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
                dangerouslySetInnerHTML={{ __html: t('Thank you! We’ve sent the code,<br />catch it 👇') }}
            />

            <Confirmation
                email={formattedMaskedEmail}
                state={confirmationState}
                onChangeState={setConfirmationState}
                onInputFinished={handleInputFinished}
                onEmailCodeRetry={handleEmailCodeRepeat}
                countdownDuration={60_000}
                clearCodeOnError={false}
                requiredCharAmount={EMAIL_CONFIRMATION_CODE_LENGTH}
                texts={texts}
            />
        </MainLayout>
    );
}