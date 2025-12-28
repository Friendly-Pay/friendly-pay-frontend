import { ReactNode } from 'react';

export type ConfirmationState =
    | 'INITIAL' // начальное состояние
    | 'CODE_CHECKING' // проверка кода
    | 'CODE_SENDING' // повторная отправка кода
    | 'CODE_ERROR' // ошибка, когда ввели неверный код
    | 'CODE_EXPIRED'; // ошибка, когда код устарел, но можно запросить новый

export interface ConfirmationTexts {
    /**
     * Экран INITIAL
     */
    title?: ReactNode; // заголовок
    codeError?: string; // ошибка проверки кода
    codeErrorExpired?: string; // код устарел, запросите новый
    codeSended?: string; // код отправлен
    buttonRetry?: string; // кнопка повторной отправки кода
    linkToSupport?: string; // ссылка на экран HINT
    countdown?: string; // 'запросить повторно можно через'
}