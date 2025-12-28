import { Countdown } from './Countdown';
import { ConfirmationState, ConfirmationTexts } from './types';
import { ONE_MINUTE, useCountdown } from '@/hooks/useCountdown';
import { usePrevious } from '@/hooks/usePrevious';
import { Text } from '@/uikit';
import { CodeInput, CodeInputProps, CustomInputRef } from '@/uikit/CodeInput';
import { openTelegramLink } from '@/utils';
import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Confirmation.module.scss';

export interface ConfirmationProps {
    /**
     * Состояние компонента
     */
    state: ConfirmationState;

    /**
     * Текст для компонента
     */
    texts: ConfirmationTexts;

    /**
     * Количество символов, которое можно ввести в поле ввода подписания до того, как произойдет автоотправка
     */
    requiredCharAmount?: number;

    /**
     * Длительность обратного отсчета на кнопке повторного запроса сообщения, в милисекундах
     */
    countdownDuration?: number;

    /**
     * Почта, на которую отправлен код
     */
    email?: string;

    /**
     * Сss класс для стилизации общей обёртки
     */
    className?: string;

    /**
     * Флаг - нужно ли очищать код при возникновении ошибки
     */
    clearCodeOnError?: boolean;

    /**
     * Функция обновления состояния компонента
     */
    onChangeState: (state: ConfirmationState) => void;

    /**
     * Обработчик события завершения ввода кода подписания
     */
    onInputFinished: (code: string) => void;

    /**
     * Обработчик события нажатия на кнопку "Запросить код"
     */
    onEmailCodeRetry: () => void;

    /**
     * Скрыть секцию с повторной отправкой кода
     * @default false
     */
    hideCountdownSection?: boolean;

    /**
     * Продолжительность отображения ошибки
     * @default 1300
     */
    errorVisibleDuration?: number;
}

const CODE_SEND_HINT_VISIBLE_DURATION = 2_000;

export const Confirmation: FC<ConfirmationProps> = ({
    state,
    texts,
    requiredCharAmount = 4,
    countdownDuration = ONE_MINUTE,
    email,
    className,
    onInputFinished,
    onChangeState,
    onEmailCodeRetry,
    clearCodeOnError = true,
    hideCountdownSection = false,
    errorVisibleDuration,
}) => {
    const inputRef = useRef<CustomInputRef>(null);
    const prevState = usePrevious(state);

    const [timeLeft, startTimer] = useCountdown(countdownDuration);

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        /**
         * Перезапускаем таймер после повторного запроса кода
         */
        if (state === 'INITIAL' && prevState === 'CODE_SENDING') {
            startTimer();
        }
    }, [state, prevState]);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }
        if (prevState === 'CODE_SENDING' && state !== 'CODE_SENDING') {
            inputRef.current.focus();
        }
    }, [prevState, state]);

    const timerId = useRef(0);
    const [codeSentHintVisible, setCodeSentHintVisible] = useState(false);

    const clearTimer = useCallback(() => {
        window.clearTimeout(timerId.current);
    }, []);

    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    useLayoutEffect(() => {
        if (prevState === 'CODE_SENDING' && state !== 'CODE_SENDING') {
            setCodeSentHintVisible(true);
            clearTimer();

            timerId.current = window.setTimeout(() => {
                setCodeSentHintVisible(false);
            }, CODE_SEND_HINT_VISIBLE_DURATION);
        }
    }, [prevState, state, clearTimer]);

    const handleInputFinished: CodeInputProps['onComplete'] = (code) => {
        onChangeState('CODE_CHECKING');
        onInputFinished(code);
    };

    const handleInputChange = () => {
        if (state === 'CODE_ERROR') {
            onChangeState('INITIAL');
        }
    };

    const handleSendCodeRetry = () => {
        if (inputRef.current) {
            inputRef.current.reset();
        }
        onChangeState('CODE_SENDING');
        onEmailCodeRetry();
    };

    const handleSupportOpen = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        openTelegramLink(import.meta.env.VITE_SUPPORT_URL);
    };

    const handleErrorAnimationEnd = () => {
        if (clearCodeOnError && state !== 'INITIAL') {
            onChangeState('INITIAL');
        }
    };

    const getCodeInputError = (): string | boolean => {
        if (state === 'CODE_EXPIRED') {
            return texts.codeErrorExpired || true;
        }
        if (state === 'CODE_ERROR') {
            return texts.codeError || true;
        }
        return false;
    };

    const processing = ['CODE_CHECKING', 'CODE_SENDING'].includes(state);
    const timePassed = timeLeft === 0;

    return (
        <div className={classNames(styles.root, className)}>
            {email
                ? <Text
                    type='body'
                    align='left'
                    weight='medium'
                    className={styles.email}
                >
                    Отправлен на {email}
                </Text>
                : null}

            <CodeInput
                disabled={processing}
                error={getCodeInputError()}
                ref={inputRef}
                fields={requiredCharAmount}
                className={styles.codeInput}
                onComplete={handleInputFinished}
                onChange={handleInputChange}
                clearCodeOnError={clearCodeOnError}
                errorVisibleDuration={errorVisibleDuration}
                onErrorAnimationEnd={handleErrorAnimationEnd}
            />

            {!hideCountdownSection && (
                <Countdown
                    timeLeft={timeLeft}
                    texts={texts}
                    processing={processing}
                    timePassed={timePassed}
                    codeSentHintVisible={codeSentHintVisible}
                    handleEmailRetryClick={handleSendCodeRetry}
                />
            )}

            <div className={styles.linkWrap}>
                <a
                    href={import.meta.env.VITE_SUPPORT_URL}
                    className={styles.link}
                    onClick={handleSupportOpen}
                >
                    {texts.linkToSupport}
                </a>
            </div>
        </div>
    );
};